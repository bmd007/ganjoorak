package io.github.bmd007.poem.ganjoorak.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
class SpaController {
    @RequestMapping({"/{path:[^\\.]*}", "/{path:[^\\.]*}/{subpath:[^\\.]*}", "/{path:[^\\.]*}/{subpath:[^\\.]*}/{subsubpath:[^\\.]*}"})
    String forward() {
        return "forward:/index.html";
    }
}
