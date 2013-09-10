import webapp2

from templateHelper import renderHandler

from const import CLASS_ACTIVE

str_title = 'Web search in GAE by Santiago Arias'
str_meta_content = "Google App engine web search python Santiago Arias"

class Page1Handler(renderHandler):

    def get(self):
        str_address = 'page1'
        bpage1 = True
        self.render('page1.html',
                    str_address = str_address,
                    str_title = str_title, 
                    str_active = CLASS_ACTIVE,
                    str_meta_content = str_meta_content,
                    bpage1 = bpage1)

class Page2Handler(renderHandler):

    def get(self):
        str_address = 'page2'
        bpage2 = True
        self.render('page2.html',
                    str_address = str_address,
                    str_title = str_title, 
                    str_active = CLASS_ACTIVE,
                    str_meta_content = str_meta_content,
                    bpage2 = bpage2)

class Page3Handler(renderHandler):

    def get(self):
        str_address = 'page3'
        bpage3 = True
        self.render('page3.html',
                    str_address = str_address,
                    str_title = str_title, 
                    str_active = CLASS_ACTIVE,
                    str_meta_content = str_meta_content,
                    bpage3 = bpage3)

class Page4Handler(renderHandler):

    def get(self):
        str_address = 'page4'
        bpage4 = True
        self.render('page4.html',
                    str_address = str_address,
                    str_title = str_title, 
                    str_active = CLASS_ACTIVE,
                    str_meta_content = str_meta_content,
                    bpage4 = bpage4)
