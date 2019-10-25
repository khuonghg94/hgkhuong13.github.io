package attendance;

import java.io.IOException;
import java.io.PrintWriter;
 
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
 
public class LoginController extends HttpServlet {

	private static final long serialVersionUID = 1L;

	protected void doPost(HttpServletRequest request,
            HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("text/html; charset=UTF-8");
		response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
 
        String name = request.getParameter("name");
        String password = request.getParameter("password");
 
        Login bean = new Login();
        bean.setUsername(name);
        bean.setPass(password);
        request.setAttribute("bean", bean);
 
        boolean status = bean.validate();
 
        if (status) {
            RequestDispatcher rd = request
                    .getRequestDispatcher("result.jsp");
            rd.forward(request, response);
        } else {
            RequestDispatcher rd = request
                    .getRequestDispatcher("login-error.jsp");
            rd.forward(request, response);
        }
    }
 
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        doPost(req, resp);
    }
}
