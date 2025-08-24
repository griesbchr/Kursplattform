function lockSheet(sheet_id){

  // Wait for exclusive access to docId
  var ready = false;
  // Get a script lock, because we're about to modify a shared resource, namely the property service.
  var property_lock = LockService.getScriptLock();

  var sheet_lock_timeout = 300   //seconds
  var start_time = Math.floor(new Date().getTime() / 1000);
  var current_time;
  var properties;

  while (!ready) {

    //check if document can be locked
    properties = PropertiesService.getScriptProperties();
    //check if document is locked or property service is locked
    //printScriptProperties()
    //console.log("property lock: " + property_lock.hasLock())
    if (properties.getProperty(sheet_id) != null || property_lock.hasLock())
    {
      //console.log("Sheet " + sheet_id + " is locked or property services is locked. Trying again later")
      Utilities.sleep(1000)

    }else if (property_lock.tryLock(1000)) { //if sheet is available, get lock to property sercive and lock resource
      ////// Critical section begins   vvvvv      
      properties = PropertiesService.getScriptProperties();
      //console.log("try document lock")
      // If nobody has "locked" this document, lock it; we're ready.
      if (properties.getProperty(sheet_id) == null) {
        // Set a property with key=sheet_id.
        properties.setProperty(sheet_id,"Locked"); 
        ready = true;
        //console.log("successfully aquired document lock, releasing properties lock")
        property_lock.releaseLock();

        break;
      }else
      {
        //console.log("aquiring document lock failed. Releasing properties lock and try again")
      }
      ////// Critical section ends     ^^^^^
      
      property_lock.releaseLock();
    }else{
      //console.warn("could not aquire lock to property service!")
    }
    //console.log("failed to aquire lock, try again within timeout time")
    current_time = Math.floor(new Date().getTime() / 1000)

    if (current_time - start_time > sheet_lock_timeout)
    {
      throw new Error("Could not aquire sheet lock of sheet with GID "+sheet_id+" within "+sheet_lock_timeout+" seconds.")
    }

  }
}

function propTest()
{
  var properties = PropertiesService.getScriptProperties();
  console.log(properties.getProperty(0))
  console.log(properties.getProperty(0) != null)
  console.log(properties.getProperty(1) == null)

}


function printScriptProperties()
{
  var properties = PropertiesService.getScriptProperties();
  console.log("Script properties: " + properties.getKeys())
}

function releaseSheetLock(sheet_id)
{
  var properties = PropertiesService.getScriptProperties();

  // Delete the "key" for this document, so others can access it.
  properties.deleteProperty(sheet_id); 
  //console.log("released lock")
}