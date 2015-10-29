window.addEventListener('load', function() {
	Parse.initialize("0LCT1aORtVa0XzifTpZhx3Lo101RQeUMqmHYbXFx", 
                 "CwhXxPCyxt9XCLG1gJMnG2meg5TBTY0utpePdSLB");

	var User = Parse.Object.extend('User');
	var Review = Parse.Object.extend('Review');

	document.getElementById('new-button').onclick = newReview;
	document.getElementById('submit-review').onclick = saveReview;

	getReviews();

	function getReviews() {
		console.log('getting reviews');
		var query = new Parse.Query(Review);
		query.find({
			success: function(data) {
				console.log(data);
				postReviews(data);
			}, error: function(e) {
				console.log(e);
			}
		});
	} 


	function postReviews(data) {
		console.log('sup brah')
		console.log(data);
		var parent = document.getElementById('reviews');
		parent.innerHTML = '';

		var total = 0;

		for (dat in data) {
			dat = data[dat];
			total+= Number(dat.get('rating') ? dat.get('rating') : 0);

			var wrap = document.createElement('div');
			var title = document.createElement('h4');
			var text = document.createElement('p');
			var rating = document.createElement('div');
			var voteWrap = document.createElement('div');
			var voteGood = document.createElement('span');
			var voteBad = document.createElement('span');
			var recommend = document.createElement('p');
			var remove = document.createElement('span');

			wrap.classList.add('review');
			title.innerHTML = dat.get('title'); //sanitize output
			title.innerHTML = $(title).text(); //cause $(dat.get('title').title()) won't work
			text.innerHTML = dat.get('text');
			text.innerHTML = $(text).text(); 
			$(rating).raty({readOnly: true, score: dat.get('rating')});
			voteGood.classList.add('glyphicon', 'glyphicon-arrow-up');
			voteBad.classList.add('glyphicon', 'glyphicon-arrow-down');
			voteGood.onclick = voteUp;
			voteBad.onclick = voteDown;
			recommend.innerHTML = 'Was this review helpful? ';
			recommend.id = dat.id;
			console.log(dat.get('objectId'));
			remove.innerHTML = ' remove review';
			remove.onclick = deleteReview;
			remove.classList.add('subtitle');
/*			recommend.classList.add('subtitle');
*/
			voteGood.innerHTML+= dat.get('voteGood') + ' ';
			voteBad.innerHTML+= dat.get('voteBad') + ' ';
			recommend.appendChild(voteGood);
			recommend.appendChild(voteBad);
			recommend.appendChild(remove);

			wrap.appendChild(title);
			wrap.appendChild(rating);
			wrap.appendChild(text);
			wrap.appendChild(recommend);

			parent.appendChild(wrap);
		}

		console.log(total)
		total = Math.round(10 * total / data.length) / 10;
		$('#average').raty({readOnly: true, score: total});
	}

	function newReview() {
		$('#review-rating').raty({score: 3});
		this.classList.add('hidden');
		document.getElementById('new-review').classList.remove('hidden');
	}

	function saveReview() {
		this.parentNode.parentNode.classList.add('hidden');
		document.getElementById('new-button').classList.remove('hidden');

		var title = document.getElementById('title');
		var text = document.getElementById('text');

		var review = new Review();
		review.set('title', title.value);
		review.set('text', text.value);
		review.set('rating', Number($('#review-rating input').attr('value')));
		review.set('voteGood', 0);
		review.set('voteBad', 0);

		review.save({
			success: function() {
				getReviews();
			}, error: function(e) {
				console.log(e);
			}
		});

		title.value = null;
		text.value = null;
	}

	function voteUp() {
		vote(true, this);
	}

	function voteDown() {
		vote(false, this);
	}

	function vote(way, obj) {
		console.log('new vcote registered')
		var query = new Parse.Query(Review);
		query.get(obj.parentNode.id, {
			success:  function(dat) {
				dat.increment(way ? 'voteGood' : 'voteBad')
				dat.save({
					success: getReviews
				})
			}
		})
	}

	function deleteReview() {
		var id = this.parentNode.id;
		console.log(id);
		var query = new Parse.Query(Review);
		query.get(id, {
			success: function(dat) {
				dat.destroy({
					success: getReviews
				})
			}
		})
	} 

});
