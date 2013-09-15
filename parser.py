
from google.appengine.api import urlfetch

from django.template import defaultfilters

from unicodedata import normalize


def parse(d, invertedIndex, termFrequency, termFrequencyByDoc, docFrequencyByTerm):
    '''
    take a document d and extract the valid search terms in it.
    once we have all these terms we build the inverted index data structure
    
    Inverted index 
    A dictionary of words as keys and a list of docIDs as values
    
    Term frequency: 
    A dictionary of words as keys and the count of each time the term occurs as value 
    
    Term frequency by document: 
    A dictionary with a tuple of word and docID as key and the count of 
    each time a term occurs as value.
    
    Document frequency by term: 
    A dictionary of words as keys and a list of docIDs as values.
    we add as many times the same docID as necesary. With this we can later
    calculate the frequency of a term in a document by just counting the number of times
    a docID appeard for a specific key
    
    '''

    result = urlfetch.fetch(d.url)
    id = int(d.key().name())
    if result.status_code == 200:
        content = defaultfilters.striptags(result.content)
        content = content.replace('\n',' ')
        content = content.split()
        for c in content:
            if c is not None:
                c = remove_accents(c.lower())

                # build inverted index 
                if c not in invertedIndex:
                    invertedIndex[c] = []
                    invertedIndex[c].append(id)
                else:
                    if id not in invertedIndex[c]:
                        invertedIndex[c].append(id)

                # build document frequency
                if c not in termFrequency:
                    termFrequency[c]= 1
                else:
                    termFrequency[c] = termFrequency[c] + 1

                # build term frequency
                if (c,id) not in termFrequencyByDoc:
                    termFrequencyByDoc[(c,id)] = 1
                else:
                    termFrequencyByDoc[(c,id)] = termFrequencyByDoc[(c,id)] +1

                # build document frequency by term
                if c not in docFrequencyByTerm:
                    docFrequencyByTerm[c] = [id]
                else:
                    docFrequencyByTerm[c].append(id)

def remove_accents(input_str):
    nkfd_form = normalize('NFKD', input_str)
    only_ascii = nkfd_form.encode('ASCII', 'ignore')
    return only_ascii
