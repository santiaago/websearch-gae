import webapp2
import logging

from templateHelper import renderHandler

from dbDocMapping import DocMapping
from crawler import crawl

from const import CLASS_ACTIVE
from const import MYURL

class Enum(set):
    def __getattr__(self, name):
        if name in self:
            return name
        raise AttributeError

MODE = Enum(["SEARCH", "CRAWL"])

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
        current_mode = self.getCurrentMode()

        if current_mode == MODE.SEARCH:
            user_search = self.request.get('inputSearch')
            
            words = user_search.split()
            words = list(set(words))
        
            results = []
            
            self.render('search.html',
                        str_address = 'search',
                        str_active = CLASS_ACTIVE,
                        query = user_search,
                        results = results[:10],
                        bsearch = True)
        elif current_mode == MODE.CRAWL:
            try:
                logging.info('fetching urls from ' + MYURL)
                crawled = crawl(MYURL)
            except:
                logging.error('An error occured when crawling from url: ' + MYURL)
                self.redirect('/search')
                return
            
            DocMapping.clean()
            DocMapping.add_list(crawled)
            
            self.redirect('/search')



    def getCurrentMode(self):
        'determine current post mode'
        logging.info('getCurrentMode: determine current post mode')

        mode = ''
        user_crawl = self.request.get('inputSubmitCrawl')   
        if user_crawl:
            return MODE.CRAWL
        user_search = self.request.get('inputSubmitSearch')
        if user_search:
            return MODE.SEARCH
        return mode
