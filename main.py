
import webapp2

from templateHelper import renderHandler

from pages import Page1Handler, Page2Handler, Page3Handler, Page4Handler
from search import SearchHandler

from const import CLASS_ACTIVE

class MainHandler(renderHandler):

    def get(self):
        str_title = 'Web search in GAE by Santiago Arias'
        str_meta_content = "Google App engine web search python Santiago Arias"
        str_address = ''
        bhome = True
        self.render('main.html',
                    str_address = str_address,
                    str_title = str_title, 
                    str_active = CLASS_ACTIVE,
                    str_meta_content = str_meta_content,
                    bhome = bhome)

app = webapp2.WSGIApplication([('/', MainHandler),
                               ('/page1/?', Page1Handler),
                               ('/page2/?', Page2Handler),
                               ('/page3/?', Page3Handler),
                               ('/page4/?', Page4Handler),
                               ('/search/?', SearchHandler)],

                              debug=True)
