/* global $ */
$(function () {
  const $modal = $('#modal')
  const apiURL = '//openclipart.org/search/json/'
  const $sort = $('#sort')
  const $search = $('#search')
  const $count = $('#count')
  const $images = $('#images')
  const $go = $('#go')
  const $form = $('form')
  var timer

  const imgClick = function (ev) {
    const it = $(this).data('info')
    /*
     * http://leonidas.github.io/transparency/
     * Refer to index.html #modal for the template.
     * It's plain html where the classes are used
     * to fill in the blanks, matching with the fields
     * of the given object (it).
     * See addImg() and fetchResults() where the object is set.
     * Here is an example of the given object:
{
  "title": "six - animal",
  "uploader": "horse50",
  "total_favorites": 10,
  "description": "Animal shaped number six.",
  "tags": "cartoon, chiffre, six",
  "tags_array": [ "cartoon", "chiffre", "six"],
  "svg_filesize": 14710,
  "downloaded_by": 12264,
  "detail_link": "https://openclipart.org/detail/71125/six%20-%20animal",
  "id": 71125,
  "created": "2010-07-07 02:55:31",
  "svg": {
    "url": "https://openclipart.org/download/71125/six.svg",
    "png_thumb": "https://openclipart.org/image/250px/svg_to_png/71125/six.png",
    "png_full_lossy": "https://openclipart.org/image/800px/svg_to_png/71125/six.png",
    "png_2400px": "https://openclipart.org/image/2400px/svg_to_png/71125/six.png"
  },
  "dimensions": {
    "png_thumb": {
      "width": 217,
      "height": 250
    },
    "png_full_lossy": {
      "width": 693,
      "height": 800
    }
  }
}
     * Setting attributes is less straightforward,
     * but the following directives should give you an idea.
     */
    const directives = {
      title: { href: function () { return this.detail_link } },
      tags_array: { label: { text: function () { return this.value } } },
      svg: { src: function () { return this.svg.url } }
    }
    $modal.render(it, directives)
    $modal.foundation('open')
  }

  // add a single image and onClick handler
  const addImg = function (img) {
    const $img = $('<img class="thumbnail" src="' + img.svg.png_thumb + '">')
    $img.data('info', img)
    $img.one('load', function (ev) { $(this).fadeIn() })
    $img.click(imgClick)
    const $el = $('<div class="column small-6 medium-4 large-2">')
    $el.html($img)
    $images.append($el)
  }

  // clear and add all images in the array data.payload
  const addImgs = function (data) {
    clearInterval(timer)
    $images.empty()
    data.payload.forEach(addImg)
    $go.text('Go').removeClass('warning')
    $form.prop('disabled', false)
  }

  // closure to stash a couple of internal variables
  const goText = (function () {
    var count = 0
    var str = '1s'
    return function () {
      var r
      if (++count === 4) {
        count = 0
        str = '1s'
      } else {
        for (r = 0; r < count; ++r) { str += '.' }
      }
      $go.text(str)
    }
  })()

  // search using API and return results
  const fetchResults = function () {
    const query = {
      query: $search.val(),
      amount: $count.val(),
      sort: $sort.val()
    }
    $go.text('1s').addClass('warning')
    timer = setInterval(goText, Math.log($count.val()) * 60)
    $form.prop('disabled', true)
    $modal.foundation('close')
    $.getJSON(apiURL, query, addImgs)
  }

  const formSubmit = function (ev) {
    ev.preventDefault()
    fetchResults()
  }

  // prepare handlers
  const setup = function () {
    $(document).foundation()
    $form.submit(formSubmit)
    $('.tags_array').on('click', '.label', function () {
      $search.val($(this).text())
      fetchResults()
    })
  }

  setup()
})
