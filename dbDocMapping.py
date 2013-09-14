import os
import webapp2
import time
import datetime
import logging

from templateHelper import render_str

from google.appengine.ext import db
from google.appengine.api import memcache


class DocMapping(db.Model):
    '''
    data structure to keep docID and urls:
    key_name: docID
    url: url mapped to the docID

    '''
    url = db.StringProperty(required = True)
    created = db.DateTimeProperty(auto_now_add = True) # current time when created
    
    def render(self, score = 0):
        self._render_text = self.url
        self._score = str(score)
        return render_str('docMapping.html', d = self)

    @staticmethod
    def add_list(urls):
        'add list to DocMapping'
        logging.info('adding list to DocMapping')

        for id in range(1,len(urls)+1):
            d = []
            d = DocMapping(key_name =  str(id), url = urls[id-1] )
            logging.info('adding:')
            logging.info(str(id))
            logging.info((str(urls[id-1])))
            d.put()
        logging.info('done with DocMapping.add_list()')

    @staticmethod
    def clean():
        'clean entity from datastore'
        
        logging.info('cleaning entity DocMapping from datastore')
        q = db.GqlQuery('SELECT * FROM DocMapping')
        results = q.fetch(1000)
        while results:
            db.delete(results)
        results = q.fetch(1000, len(results))
        logging.info('done with DocMapping.clean()')
