---
title: Algolia Search Test
date: 2023-01-09
draft: true
---

<input id="searchbox"/>
<div id="hits"></div>


<script src="https://cdn.jsdelivr.net/npm/algoliasearch@4.14.2/dist/algoliasearch-lite.umd.js" integrity="sha256-dImjLPUsG/6p3+i7gVKBiDM8EemJAhQ0VvkRK2pVsQY=" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/instantsearch.js@4.49.1/dist/instantsearch.production.min.js" integrity="sha256-3s8yn/IU/hV+UjoqczP+9xDS1VXIpMf3QYRUi9XoG0Y=" crossorigin="anonymous"></script>
<script>
const searchClient = algoliasearch('QNV5GOVV6P', '9e6a42783b13baed13f2c6c7dafcae40');

const search = instantsearch({
  indexName: 'netlify_673ccdde-2c26-40f1-b781-470308fbf6c2_master_all',
  searchClient,
});

search.addWidgets([
  instantsearch.widgets.searchBox({
    container: '#searchbox',
  }),

  instantsearch.widgets.hits({
    container: '#hits',
    templates: {
      item: document.getElementById('hit-template').innerHTML,
      empty: "We didn't find any results for the search <em>\"{{query}}\"</em>"
    }
  })
]);

search.start();
</script>
<script type="text/html" id="hit-template">
  <div class="hit">
    <div class="hit-image">
      <img src="{{image}}" alt="{{title}}"/>
    </div>
    <div class="hit-content">
      <h3 class="hit-name">{{{_highlightResult.title.value}}}</h3>
      <p class="hit-description">{{{_highlightResult.content.value}}}</p>
    </div>
  </div>
</script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/instantsearch.css@7.4.5/themes/reset-min.css" integrity="sha256-QlHlZdbSVxaYkUHxhMFhAj/L3pJiW1LuomSCONXBWms=" crossorigin="anonymous">
