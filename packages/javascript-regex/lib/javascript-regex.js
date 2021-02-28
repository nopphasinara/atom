const scopeNameList = ['source.js', 'source.ts', 'source.flow'];

const regexInjectionPoint = {
	type: 'regex',
	
	language(regexNode){
		//console.log('language()');
		
		const {lastChild} = regexNode;
		if(lastChild.type === 'regex_flags'){
			let flags = lastChild.text,
				validFlags = 'gimsy',
				setFlags = [];
			for(let i=0; i<=validFlags.length && i<flags.length; i++){
				if(flags[i] === 'u'){
					//unicode flag is set; use the "tree-sitter-regex-unicode-js" grammar
					return 'regex-unicode-js';
				}
				let f = validFlags.indexOf(flags[i]);
				if(f < 0 || setFlags[f]) break;	//invalid flag or duplicate flag
				setFlags[f] = true;	//mark the flag as set
			}
		}
		//unicode flag is not set; use the "tree-sitter-regex-js" grammar
		return 'regex-js';
	},
	
	content(regexNode){
		//console.log('content()');
		
		//return the pattern
		return regexNode.children[1];
	}
};

function setUpInjectionPointsForGrammar(grammar){
	//console.log('setUpInjectionPointsForGrammar()');
	
	if(scopeNameList.includes(grammar.id)){
		if(grammar.injectionPointsByType['regex_pattern']){
			//delete injection point "regex_pattern"
			delete grammar.injectionPointsByType['regex_pattern'];
		}
		let injPnts;
		if(!(injPnts = grammar.injectionPointsByType['regex']) || !injPnts.includes(regexInjectionPoint)){
			//add injection point "regex"
			grammar.addInjectionPoint(regexInjectionPoint);
		}
	}
}

function reloadPackageGrammars(packageName){
	//console.log('reloadPackageGrammars()');
	//this function is based on:
	// https://github.com/MasseGuillaume/atom-live-grammar-reload/blob/89bb1305318ffd2b0a12e37ee70004d8d7eae81e/index.coffee
	
	//for each grammar loaded in Atom
	for(grammar of atom.grammars.grammars){
		//if the grammar is part of the package
		if(grammar.packageName === packageName){
			//remove the grammar
			atom.grammars.removeGrammar(grammar);
		}
	}
	//unload the package (by force)
	delete atom.packages.loadedPackages[packageName];
	//reload the package
	const updatedPackage = atom.packages.loadPackage(packageName);
	//reload its grammars
	updatedPackage.loadGrammarsSync();
	updatedPackage.grammars.forEach((grammar)=>{
		atom.grammars.addGrammar(grammar);
	});
}

exports.activate = function () {
	//console.log('activate()');
	
	for(const scopeName of scopeNameList){
		setUpInjectionPointsForGrammar(atom.grammars.treeSitterGrammarsById[scopeName]);
	}
	reloadPackageGrammars('javascript-regex');
}