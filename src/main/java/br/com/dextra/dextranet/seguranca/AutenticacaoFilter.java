package br.com.dextra.dextranet.seguranca;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;

public class AutenticacaoFilter implements Filter {

    private String excludePatterns = "";

    @Override
    public void doFilter(ServletRequest request, ServletResponse response,
                    FilterChain filterChain) throws IOException, ServletException {

            UserService userService = UserServiceFactory.getUserService();
            HttpServletResponse httpResponse = (HttpServletResponse) response;
            HttpServletRequest httpRequest = (HttpServletRequest) request;

            String thisURI = httpRequest.getRequestURI();

            if (userService.getCurrentUser() != null) {
                    filterChain.doFilter(request, response);
            } else if (thisURI.contains(excludePatterns)) {
                    filterChain.doFilter(request, response);
            } else {
                    String loginUrl = userService.createLoginURL(thisURI);
                    httpResponse.sendRedirect(loginUrl);
            }
    }

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
            this.excludePatterns = filterConfig.getInitParameter("excludePatterns");
    }

    @Override
    public void destroy() {
    }


}
