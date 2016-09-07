$(function () {
  const apiURL = 'https://openclipart.org/search/json/'
  const $sort = $('#sort')
  const $search = $('#search')
  const imgClick = function (ev) {
    const $self = $(this)
    ev.preventDefault()
    $self.fadeOut(function () { $self.remove() })
  }

  const addImg = function (img) {
    const $img = $('<img class="thumbnail" src="' + img.svg.png_thumb + '">')
    $img.one('load', function (ev) { $(this).fadeIn() })
    $img.click(imgClick)
    const $el = $('<div class="column small-6 medium-4 large-2">')
    $el.html($img)
    $('#images').prepend($el)
  }

  const addImgs = function (data) { data.payload.forEach(addImg) }

  const formSubmit = function (ev) {
    ev.preventDefault()
    const query = {
      query: $search.val(),
      amount: 12,
      sort: $sort.val()
    }
    $.getJSON(apiURL, query, addImgs)
  }

  $(document).foundation()
  $('form').submit(formSubmit)
})
