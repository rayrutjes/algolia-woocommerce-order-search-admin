var client = algoliasearch(aosOptions.appId, aosOptions.searchApiKey);
var index = client.initIndex(aosOptions.ordersIndexName);
autocomplete('#post-search-input', { hint: false, openOnFocus: true, debug: aosOptions.debug }, [
  {
    source: autocomplete.sources.hits(index, { hitsPerPage: 7 }),
    displayKey: 'number',
    templates: {
      suggestion: function(suggestion) {
        return ""
          + getStatusLine(suggestion)
          + getNumberLine(suggestion)
          + getCustomerLine(suggestion)
          + getTotalsLine(suggestion)
          + getMethodsLine(suggestion);
      },
      footer: function(){
        return '<a href="https://www.algolia.com/"><img class="aos-powered-by" src="http://res.cloudinary.com/hilnmyskv/image/upload/v1487071435/search-by-algolia.svg"></a>';
      }
    }
  }
]).on('autocomplete:selected', function(event, suggestion, dataset) {
    window.location.href = "post.php?post=" + suggestion.objectID + "&action=edit";
});
jQuery('#post-search-input').focus();

function getStatusLine(suggestion) {
  return '<div class="aos-order__line">'
  + '<span class="aos-order__status">' + suggestion._highlightResult.status_name.value + '</span>'
  + '</div>';
}

function getNumberLine(suggestion) {
  return '<div class="aos-order__line">'
    + '<span class="aos-order__number">#' + suggestion._highlightResult.number.value + '</span> - '
    + '<span class="aos-order__date">' + suggestion.date_formatted + '</span>'
    + '</div>';
}

function getCustomerLine(suggestion) {
  if(typeof suggestion.customer === 'undefined') {
    return 'Anonymous user';
  }

  return suggestion._highlightResult.customer.display_name.value
    + ' (' + suggestion._highlightResult.customer.email.value + ')';
}

function getTotalsLine(suggestion) {
  return '<div class="aos-order__line">'
    + '<span class="aos-order__items">' + suggestion.items_count + ' item(s)</span>'
    + '<span class="aos-order__total">' + suggestion.formatted_order_total + '</span>'
    + '</div>';
}

function getMethodsLine(suggestion) {
  var html = '';
  if(suggestion.shipping_method_title) {
    html += '<span class="aos-order__shipping-method">' + suggestion.shipping_method_title + '</span>';
  }
  if(suggestion.payment_method_title) {
    html += '<span class="aos-order__payment-method">' + suggestion.payment_method_title + '</span>';
  }

  if(html.length === 0) {
    return '';
  }

  return '<div class="aos-order__line">'+ html + '</div>';
}