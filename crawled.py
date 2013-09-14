import webapp2

from templateHelper import renderHandler

from dbDocMapping import DocMapping
from const import CLASS_ACTIVE

str_title = 'Web search in GAE by Santiago Arias'
str_meta_content = "Google App engine web search python Santiago Arias"

class CrawledHandler(renderHandler):

    def get(self):
        str_address = 'crawled'

        docs = DocMapping.all()

        self.render('crawled.html',
                    str_address = str_address,
                    str_title = str_title, 
                    str_active = CLASS_ACTIVE,
                    str_meta_content = str_meta_content,
                    docs = docs)
