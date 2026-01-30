let agreementRequest = fetch('terms-of-service.json');

window.addEventListener('DOMContentLoaded', async e => {
	let loadingError = false;
	function placeChildRandomly(parentElement, childElement) {
		let padding = 10
		let width = parentElement.clientWidth;
		let height = parentElement.clientHeight;

		let childWidth = childElement.offsetWidth;
		let childHeight = childElement.offsetHeight;

		let positionX = (((width - childWidth - padding * 2) * Math.random()) + padding).toFixed(0);
		let positionY = (((height - childHeight - padding * 2) * Math.random()) + padding).toFixed(0);

		childElement.style.top = `${positionY}px`;
		childElement.style.left = `${positionX}px`;
	}

	let tosContainer = document.querySelector("#tos-container");
	let tosContinue = document.querySelector("#tos-continue");
	let tosCompletedImage = new Image()
	tosCompletedImage.src = "check.svg";
	let resizeTimeout = null;

	let button = document.createElement('button');

	let agreement = await agreementRequest
		.then(agreementRequest => agreementRequest.json())
		.catch(_err => {
			loadingError = true;
			return { text: "There was an error loading the terms of service. This is not a legally binding agreement. Please refresh the page or if the issue persists try again later." }
		})
		.then(agreementRequest => agreementRequest.text.split(" "));

	button.textContent = agreement.shift();
	button.setAttribute('type', 'button');

	tosContainer.append(button);

	placeChildRandomly(tosContainer, button);

	tosContinue.setAttribute('disabled', true);

	button.addEventListener('click', _e => {
		if (agreement.length > 0) {
			button.textContent = agreement.shift();

			placeChildRandomly(tosContainer, button);
		} else {
			tosContainer.removeChild(button);

			if (!loadingError) {
				tosContinue.removeAttribute('disabled');
				tosContainer.appendChild(tosCompletedImage);
				resizeObserver.unobserve(tosContainer);
			}
		}
	});

	let firstRun = true
	let resizeObserver = new ResizeObserver(obj => {
		if (resizeTimeout != null) clearTimeout(resizeTimeout);
		if (!firstRun)
			resizeTimeout = setTimeout(() => {
				placeChildRandomly(tosContainer, button);
			}, 100);
		else firstRun = false;
	});

	resizeObserver.observe(tosContainer);
})