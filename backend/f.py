import urllib.request
def info(url):
    try:
        html = urllib.request.urlopen(url).read().decode('utf-8')
        t = html.split('<title>')[1].split('</title>')[0]
        desc = html.split('"shortDescription":"')[1].split('",')[0] if '"shortDescription":"' in html else ''
        date = html.split('<meta itemprop="datePublished" content="')[1].split('">')[0] if '<meta itemprop="datePublished" content="' in html else '2023-01-01'
        print('Title:', t, 'Date:', date, '\nDesc:', desc[:500])
    except Exception as e:
        print(e)
info('https://www.youtube.com/watch?v=6q3ylde-i7w')
info('https://www.youtube.com/watch?v=E4G-4CAEDUM')