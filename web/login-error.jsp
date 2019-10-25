<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Insert title here</title>
</head>
<body>
	<p>Bạn đã nhập sai tên hoặc mật khẩu. Mời bạn nhập lại!</p>
  	<input type="button" id="back" value="Trở lại trang đăng nhập">
</body>
<script type="text/javascript">
    document.getElementById("back").onclick = function () {
        location.href = "http://localhost:8080/Demo/login.jsp";
    };
</script>
</html>