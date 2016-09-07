$(function () {
  var $img
  const $sort = $('#sort')
  const $search = $('#search')
  $('form').submit(function (ev) {
    ev.preventDefault()
    const search = $search.val()
    const sortType = $sort.val()
    const query = {
      query: search,
      amount: 10,
      sort: sortType
    }
    console.log(search, sortType)
    $.getJSON('https://openclipart.org/search/json/', query, function (data) {
      data.payload.forEach(function (img) {
        if (img.svg && img.svg.png_thumb) {
          $img = $('<img style="display: none" src="' + img.svg.png_thumb + '">')
          $img.one('load', function () { $(this).fadeIn() })
          $('#images').prepend($img)
        }
      })
      $(document).foundation()
    })
  })
})
