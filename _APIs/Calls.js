function postTFApi(action_string, payload) 
{
  var options = {
    'method': 'post',
    'contentType': 'application/json',
    // Convert the JavaScript object to a JSON string.
    'payload': JSON.stringify(payload),
    'muteHttpExceptions': true
  };
  try {
    var url = PropertiesService.getScriptProperties().getProperty("TF_POST_URL") + "?request_type=" + action_string;
    UrlFetchApp.fetch(url, options);
  } catch (e) {
    console.error("[API]An error occured when trying to POST a message to TF Api. Message: " + e.message)
    throw e
  }
}

function getTFApi(action_string, arg) 
{
  var options = {
    'method': 'get',
    'muteHttpExceptions': true
  };
  //return robustUrlFetch(PropertiesService.getScriptProperties().getProperty("TF_GET_URL") + "?request_type=" + action_string + "&arg="+arg, options)
  try {
    var url = PropertiesService.getScriptProperties().getProperty("TF_GET_URL") + "?request_type=" + action_string + "&arg="+arg
    var response = UrlFetchApp.fetch(url, options)
    return JSON.parse(response);
  } catch (e) {
    console.error("[API]An error occured when trying to GET a message to TF Api. Message: " + e.message)
    throw e
  }
}

const NUM_THREADS = 10

function getThreadedTFApi(action_string, arglist) 
{
  Logger.log("started multithreaded get request with actionstring " + action_string)
  var number_threads = arglist.length > NUM_THREADS ? NUM_THREADS : arglist.length
  Logger.log("doing multithreading with " + number_threads + " threads")
  const job_lists = splitListEvenly(arglist, number_threads);
  
  var requests = []
  for (var job_list of job_lists)
  {
    requests.push(
      {
        'method': 'get',
        'url': PropertiesService.getScriptProperties().getProperty("TF_GET_URL") + "?request_type=" + action_string + "&arg="+job_list.join(","),
        'muteHttpExceptions': true
      }
    )
  };

  try {
    var response_array = UrlFetchApp.fetchAll(requests)
    var response_data = {};

    for (var i = 0; i < response_array.length; i++) {
      
      //console.log("[API] the following json is parsed in the "+i+"th iteration: " + response_array[i])
      var jsonObj = JSON.parse(response_array[i]);
      // Merge the parsed JSON object into the combinedDict
      for (var key in jsonObj) {
        //check if key is already in dict
        if (response_data.hasOwnProperty(key))
        {
          //try to merge the two objects
          response_data[key] = mergeObjects(response_data[key], jsonObj[key])
        }else{
          response_data[key] = jsonObj[key];
        }
        
      }
    }
    return response_data
    
  } catch (e) {
    console.error("An error occured when trying to multithreaded GET a message to TF Api. Message: " + e.message)
    throw e
  }
}

function mergeObjects(object, object_to_merge)
{
  //check if both are objects
  if (isObject(object) && isObject(object_to_merge))
    {
      //iterate over keys of (first) object
      for (let key in object) 
      {        
        current_value = object[key]
        //replace entry if current entry is empty and second dict has value
          if (current_value === null || current_value === undefined || current_value === "") {
            if (object_to_merge[key] !== undefined)
            {
              object[key] = object_to_merge[key]
            }
          }

        //check if value is another dict -> Add another key/value pair
        if (isObject(current_value))
        {
          //check if value of to_merge_object exists and is also object
          if (object_to_merge[key] !== undefined && isObject(object_to_merge[key]))
          {
            Object.assign(object[key], object_to_merge[key]);
          }
        }
      }
    }else{  //cannot merge something that is not an object, only use first object
      return object
    }

    return object
}


function isObject(obj){return typeof obj === 'object' && obj !== null && !Array.isArray(obj)}

function testPostThreadedTFApi()
{
  var action_string = ""
  var const_payload = {"constarg0": "const0", "constarg1": "const1"}
  var split_payload = {"splitarg0": [0, 1, 2, 3, 4, 5, 6], "splitarg1": [00, 11, 22, 33, 44, 55, 66]}
  postThreadedTFApi(action_string, const_payload, split_payload, 2)
}

//constructs multithreaded post request. 
//constPayload is added to each request. type: Object/dict
//splitPayload is multithreaded. type: Object/dict with potentially multiple element which are arrays with the same length!
function postThreadedTFApi(action_string, constPayload, splitPayload, number_threads)
{
  Logger.log("started multithreaded post request with actionstring " + action_string)
  var split_array_content = Object.entries(splitPayload)
  var num_arrays = split_array_content.length

  if (num_arrays == 0){throw new Error("No split array provided")}
  
  var test_len = split_array_content[0][1].length;     //0 is first element, each element is [name, array]
  
  //find number of threads if not given
  if (typeof number_threads != "number")
  {
    number_threads = test_len.length > NUM_THREADS ? NUM_THREADS : test_len.length
  }
  Logger.log("doing multithreading of " + test_len +" objects with " + number_threads + " threads")

  //check if all arrays have the same length
  var job_lists_array = []
  var arg_name_array = []
  for (var i=0; i<num_arrays; i++)
  {
    if (split_array_content[i][1].length != test_len){throw new Error("The provided split arrays dont share the same length. " + test_len + " vs. " + split_array_content[i][1].length)}
    
    arg_name_array.push(split_array_content[i][0])
    job_lists_array.push(splitListEvenly(split_array_content[i][1], number_threads))
  }


  var url =  PropertiesService.getScriptProperties().getProperty("TF_POST_URL") + "?request_type=" + action_string;

  var payload = constPayload

  var requests = []
  //loop over portions of split lists
  for (var i=0; i<job_lists_array[0].length; i++)
  { 
    //loop over different split lists
    for (var j=0; j<job_lists_array.length; j++)
    {
      //make payload
      payload[arg_name_array[j]] = job_lists_array[j][i]
    }
    
    requests.push(
      {
        'method': 'post',
        'contentType': 'application/json',
        'payload': JSON.stringify(payload),
        'url': url,
        'muteHttpExceptions': true
      }
    )
  };

  try {
    UrlFetchApp.fetchAll(requests)
    return 
  } catch (e) {
    console.error("An error occured when trying to multithreaded POST a message to TF Api. Message: " + e.message)
    throw e
  }
}

function robustUrlFetch(url, options)
{
  var max_tries = 5
  var success = false
  for (var i=0; i < max_tries; i=i+1)
  {
    try {
      var response = UrlFetchApp.fetch(url, options);
    } catch (e) 
    {
      continue
    }
    success = true
  }
  if (!success)
  {
    console.error("GET message to TF Api failed after "+String(max_tries)+" tries with error message: " + e.message)
    return -1
  } else{
    return JSON.parse(response)
  }
}


//splits list as evenly as possible
function splitListEvenly(arr, n) {
  const result = [];
  const quotient = Math.floor(arr.length / n); // Number of items in each part
  const remainder = arr.length % n; // Number of items left over

  let startIndex = 0;

  for (let i = 0; i < n; i++) {
    const endIndex = startIndex + quotient + (i < remainder ? 1 : 0);
    result.push(arr.slice(startIndex, endIndex));
    startIndex = endIndex;
  }

  return result;
}




