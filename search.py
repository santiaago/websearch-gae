import webapp2

from templateHelper import renderHandler

from const import CLASS_ACTIVE

class SearchHandler(renderHandler):

    def get(self):
        str_title = 'Web search in GAE by Santiago Arias'
        str_meta_content = "Google App engine web search python Santiago Arias"
        self.render('search.html',
                    str_address = 'search',
                    str_title = str_title, 
                    str_active = CLASS_ACTIVE,
                    str_meta_content = str_meta_content,
                    bsearch = True)
        
    def post(self):
        user_search = self.request.get('inputSearch')

        self.render('search.html',
                    str_address = 'search',
                    str_active = CLASS_ACTIVE,
                    query = user_search,
                    bsearch = True)
