import webapp2
import logging

from templateHelper import renderHandler

from dbDocMapping import DocMapping
from crawler import crawl
from parser import parse
from const import CLASS_ACTIVE
from const import MYURL

class Enum(set):
    def __getattr__(self, name):
        if name in self:
            return name
        raise AttributeError

MODE = Enum(['SEARCH', 'CRAWL', 'PARSE'])

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
            self.redirect('/crawled')

        elif current_mode == MODE.PARSE:
            # parsing mode: extract content from all documents and build data structures.
            # build inverted index
            docs = DocMapping.all()
            invertedIndex ={}
            termFrequency = {}
            termFrequencyByDoc = {}
            docFrequencyByTerm = {}
            logging.info('starting to parse all documents')
            for d in docs:
                parse(d, invertedIndex, termFrequency, termFrequencyByDoc, docFrequencyByTerm)
            logging.info('parsing done!')
            # we need to store this in a blob or cloud storage for later
            #json_str = json.dumps(invertedIndex)
            #json_str = json.dumps(termFrequency)
            #json_str = json.dumps(termFrequencyByDoc)
            #json_str = json.dumps(docFrequencyByTerm)
            self.redirect('/search')

    def getCurrentMode(self):
        'determine current post mode'
        logging.info('getCurrentMode: determine current post mode')

        mode = ''
        user_crawl = self.request.get('inputSubmitCrawl')   
        if user_crawl:
            logging.info('getCurrentMode: mode CRAWL')
            return MODE.CRAWL
        user_search = self.request.get('inputSubmitSearch')
        if user_search:
            logging.info('getCurrentMode: mode SEARCH')
            return MODE.SEARCH
        user_parse = self.request.get('inputSubmitParse')
        if user_parse:
            logging.info('getCurrentMode: mode PARSE')
            return MODE.PARSE
        logging.info('getCurrentMode: mode not found')        
        return mode
