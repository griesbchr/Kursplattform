function testGetTFApi()
{
  let ret = getTFApi("test_msg")
  console.log(ret)
}

function testGetTFApi1()
{
  let ret =  ("get_teacherfile_link", "021")
  console.log(ret)
}

function testMultiThreadedTFApi()
{
  var file_id_list = ["1QCxvB9kGzRfa2-PT3SIz2fSczCQ_HnT5mvl_HTva8Nc","1teTqt_VZjPfaBgKAwvvTRyWuUQ_Y1D8wXHyGHMs34bQ","16SaAnd9EFgAImTzQEo3xRHTtDyscueNZY3ZS3g4EB-A"]
  var list = getThreadedTFApi("get_studentinfos_thread", file_id_list)
  console.log(list)
}

function test_runner_limit()
{
  var arg_list = Array.from({ length: 20 }, () => "1");

  getThreadedTFApi("sleep", arg_list)
}