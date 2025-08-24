function createTeacherFile(id) { API.postTFApi("create_teacher_file", {"ID":id}) }

function shareTeacherFile_(id, email) { API.postTFApi("share_teacher_file", {"ID":id, "email":email}) }