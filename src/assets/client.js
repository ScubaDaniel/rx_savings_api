window.onload = () => {

	const response_field = document.getElementById('response-text'),
				form_element = document.getElementById('request-container');

	function update (event) {
		event.preventDefault();
		fetch(`http://127.0.0.1:15151/pharmacy?${getParams()}`)
				.then( response => response.json() )
				.then( jsonData => {
					response_field.value = JSON.stringify(jsonData, undefined, 2);
				});
	}

	function getParams () {
		let lat_input = document.getElementById('latitude-input').value,
				long_input = document.getElementById('longitude-input').value;

		return `latitude=${lat_input}&longitude=${long_input}`
	}

	form_element.onsubmit = update;
};