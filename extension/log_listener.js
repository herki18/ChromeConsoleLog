var JSLogCollector = {
	getSavedErrors: function() {
		var savedErrors = [];
		if (!!localStorage.JSErrors)
				savedErrors = JSON.parse(localStorage.JSErrors);

		return savedErrors;
	},
	saveErrors: function(errors) {
		localStorage.JSErrors = JSON.stringify(errors);
	},
	push: function (jsErrors) {
		var list = this.getSavedErrors();
		list.push(jsErrors);
		this.saveErrors(list);
	},
	pump: function() {
		var list = this.getSavedErrors();
		this.clear();
		return list;
	},
	clear: function() {
		this.saveErrors([]);
	},
	onError: function(errorMessage, sourceName, lineNumber) {
		
		if(!errorMessage.message) {
			return;
		}
		if(!!errorMessage.filename) {
			sourceName = errorMessage.filename;
		}
		if(!!errorMessage.lineno) {
			lineNumber = errorMessage.lineno;
		}

		if(!!errorMessage.target.chrome && !sourceName && !lineNumber && errorMessage.message != 'Script error.') {
			return;
		}	

		errorMessage = errorMessage.message;
		if(errorMessage == 'Script error.') {
			var error = {
				errorMessage: errorMessage,
				sourceName: '',
				lineNumber: 0,
				pageUrl: document.location.href	
			}
		} else {
			var error = {
				errorMessage: errorMessage.replace(/^Uncaught /g, ''),
				sourceName: sourceName,
				lineNumber: lineNumber,
				pageUrl: document.location.href	
			}
		}

		//JSErrorCollector.push(error);
	},
	initialize: function() {
		window.addEventListener('error', this.onError, false);
	}
};

JSLogCollector.initialize();

var loggs2 = [];
var oldf = console.log; 
console.log = function()
{ 
	JSLogCollector.push(arguments);
	loggs2.push(arguments); 
	oldf.apply(console, arguments); 
};
console.log("tere");

var errors2 = [];

var olde = console.error;
console.error = function () {
	errors2.push(arguments);
	olde.apply(console, arguments);
}

console.error("tere");