import logging

from google.appengine.api import urlfetch


from const import MYURL

def crawl(root):
    logging.info('crawling ' + MYURL)

    tocrawl = [root]
    crawled = []
    while tocrawl:
        page = tocrawl.pop()
        if page[0] == '/':
            page = MYURL + page
            
        if (page not in crawled) and \
           (MYURL in page) and \
           ('#' not in page) and \
           ('/search' not in page):
            f = urlfetch.fetch(page).content
            links = get_all_links(f)
            tocrawl = tocrawl + links
            crawled.append(page)

    return crawled

def get_all_links(page):
    links = []
    while True:
        url,endpos = get_next_target(page)
        if url:
            links.append(url)
            page = page[endpos:]
        else:
            break
    return links

def get_next_target(page):
    start_link = page.find('<a href=')
    if start_link == -1: 
        return None, 0
    start_quote = page.find('"', start_link)
    end_quote = page.find('"', start_quote + 1)
    url = page[start_quote + 1:end_quote]
    return url, end_quote

