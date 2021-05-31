var functions: {[k: string]: any} = {
	"print": function(text: string){console.log(text)},
	"cos": function(a:number){return Math.cos(a)},
	"sin": function(a:number){return Math.sin(a)},
	"pow": function(a:number,b:number){return a ** b;}
};

export { functions }