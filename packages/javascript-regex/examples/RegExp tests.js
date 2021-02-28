//===== Dot =====

//valid
/./;
/a.c/;


//===== Boundary Assertions =====

//valid
/^foobar$/;
/\bfoo\Bbar/;


//===== Special Escapes =====

//valid
/\f\n\r\t\v/;
/[\f\n\r\t\v]/;
/[\b]/;	//backspace
/\0/;
/\00/;
/\000/;
/[\0]/;
/[\00]/;
/[\000]/;
/\09/;
/[\09]/;


//===== Control Letter Escapes =====

//valid
/\ca/;
/[\ca]/;
/\ca_/;
/[\ca_]/;

//accepted
//`\c` is treated as two characters, '\' and 'c'
/\c/;
/\c9/;
/[\c]/;
/[\c9]/;


//===== Octal Escapes =====

//valid
/\01/;
/\07/;
/\001/;
/\007/;
/[\01]/;
/[\07]/;
/[\001]/;
/[\007]/;


//===== Hexadecimal Escapes =====

//valid
/\xff/;
/[\xff]/;
/\xff_/;
/[\xff_]/;

//accepted
//`\x` is treated as an identity escape for 'x'
/\x/;
/\xf/;
/\x_/;
/[\x]/;
/[\xf]/;
/[\x_]/;


//===== Unicode Escapes =====

//valid
/\uffff/;
/[\uffff]/;
/\uffff_/;
/[\uffff_]/;

//accepted
//`\u` is treated as an identity escape for 'u'
/\u/;
/\uf/;
/\u_/;
/[\u]/;
/[\uf]/;
/[\u_]/;
/\u{1}/;
/[\u{1}]/;
/[\u{f}]/;


//===== Identity Escapes =====

//valid
/ \^\$\\\.\*\+\?\(\)\[\]\{\}\|\//;
/[\^\$\\\.\*\+\?\(\)\[\]\{\}\|\/]/;
/\-/;
/[\-]/;
/\a/;
/[\a]/;


//===== Character Class Escapes =====

//valid
/\d\D\s\S\w\W/;
/[\d\D\s\S\w\W]/;


//===== Character Sets =====

//valid
/[]/;
/[foo]/;
/[^foo]/;
/[foo^]/;
/[\b]/;	//special escape for backspace
/[\-]/;	//identity escape for '-'
/[a-z]/;
/[a-a]/;
/[\t-a]/;
/[\t-\t]/;
/[a-\uffff]/;
/[a-\d]/;
/[\d-a]/;
/[\d-\d]/;
/[-]/;
/[--]/;
/[---]/;
/[-a-b-c-]/;
/[/]/;
/[\^\$\\\.\*\+\?\(\)\[\]\{\}\|\/\-]/;

//accepted
//`\x` is treated as an identity escape for 'x'
/[a-\x]/;
/[\x-z]/;

//invalid
/[z-a]/;	//range out of order
/[a-\t]/;	//range out of order
new RegExp('[');
/a]a/;


//===== Groups and Lookaround Assertions =====

//Note: Tree-sitter doesn't support Unicode property escapes, so I can't reasonably make this part match the spec.

//valid
/()/;
/(foo)/;
/(?:)/;
/(?:foo)/;
/(?=)/;
/(?=foo)/;
/(?!foo)/;
/(?<=foo)/;
/(?<!foo)/;
/(?<foo>)/;
/(?<foo>bar)/;
/(?<aA0_$\u0066oo>bar)/;
/(?<aa\u0066>bar)/;
/(?<aaa\u0066>bar)/;
/(a*)/;

//invalid
/(?<foo>a)(?<foo>b)/;	//duplicate group name
/(?<>bar)/;
/(?<;>bar)/;
/(?<a;b;c>bar)/;
/(?<#/;
/(?<a/;
/(?<#)/;
/(?<a)/;
/(?<#>bar)/;
/(?<a\u>bar)/;
/(?<a\u0>bar)/;
/(?<\uf>bar)/;
/(?<\t>bar)/;
/(?<#a;/;
/(?<aa;/;
/(?<#a;);/;
/(?<a;);/;
/(?<a>b/;
/(a/;
/(?:a/;
/(?=a/;
/(?!a/;
/(?<=a/;
/(?<!a/;
/(?_/;
/(?a(?:b)/;
/(?a(?:b)c)/;
/(?:a(?b)c)/;
/(?:a))(?<#)(?<#(?:a/;
/(?:a))(?<#)(?<#(?:a)/;
/(a(b/;
/(a(b)c/;
/(?:a(?:b)c/;
/(a(b(c)d(e)f/;
/(a(b(c)d(e)f)g/;
/(?=a)(?=b/;
/a);/;
/a(b)c)d/;
/a)((a*)/;
/a(*a/;
/a(_*a/;
/a)*a/;
/a)_*a/;
/(foo|bar)/;


//===== Backreferences =====

//valid
/\1\9\10\999/;
/\k<foo>/;
/\k<aA0_$\u0066oo>/;
/\k<\u0066>/;
/\k<\u0066oo>/;
/\k<aa\u0066>/;
/\k<aaa\u0066>/;

//accepted
//`\k` is treated as an identity escape for 'k'
/\k/;
/\k</;
/\k<a/;
/\k<>/;
/\k<;>/;
/\k<a;b>/;


//===== Disjunction =====

//valid
/foo|bar/;
/(foo|bar)/;
/|/;
/a||b/;


//===== Quantifiers =====

//valid
/a?_/;
/a*_/;
/a+_/;
/a??_/;
/a*?_/;
/a+?_/;
/a{1}_/;
/a{1,}_/;
/a{1,2}_/;
/a{1}?_/;
/a{1,}?_/;
/a{1,2}?_/;
/\?*/;

//accepted;
//curly braces are treated as non-syntax characters
/a{/;
/a{z/;
/a{z_/;
/a{}_/;
/a{z}_/;
/a{z_}_/;
/a{1/;
/a{1z/;
/a{1z_/;
/a{1,_/;
/a{1,2_/;
/a{1z_}_/;
/a{,2}_/;
/a{,_}_/;
/a?{/;
/a?{z/;
/a?{z_/;
/a?{z_}_/;
/a?{1/;
/a?{1z/;
/a?{1z_/;
/a?{1z_}_/;
/a?{,2}_/;
/a?{,_}_/;
/a{a/;
/a}a/;
/{a/;

//invalid
new RegExp('*');
/+_/;
/?_/;
/a?*_/;
/a?+_/;
/a**_/;
/a*+_/;
/a+*_/;
/a++_/;
/a{1}*_/;
/a{1}+_/;
/a???_/;
/a??*_/;
/a??+_/;
/a*??_/;
/a*?*_/;
/a*?+_/;
/a+??_/;
/a+?*_/;
/a+?+_/;
/a{1}??_/;
/a{1}?*_/;
/a{1}?+_/;
/a?{1}_/;
/a*{1}_/;
/a+{1}_/;
/a{1}{1}_/;
/a??{1}_/;
/a*?{1}_/;
/a+?{1}_/;
/a{1}?{1}_/;
/a(*a/;
/a)*a/;


//===== Examples =====

//URI-matching RegExp ( https://github.com/wizard04wsu/URI_Parsing )
/^(?=(?<scheme>[a-z][a-z\d+.-]*))\1:(?:\/\/(?<authority>(?:(?=(?<userinfo>(?:[\w-.~!$&'()*+,;=:]|%[\dA-F]{2})*))\3@)?(?=(?<host>\[[\dA-F:.]{2,}\]|(?:[\w-.~!$&'()*+,;=]|%[\dA-F]{2})*))\4(?::(?=(?<port>\d*))\5)?)(?<path1>\/(?=((?:[\w-.~!$&'()*+,;=:@/]|%[\dA-F]{2})*))\7)?|(?<path2>\/?(?!\/)(?=((?:[\w-.~!$&'()*+,;=:@/]|%[\dA-F]{2})*))\9)?)(?:\?(?=(?<query>(?:[\w-.~!$&'()*+,;=:@/?]|%[\dA-F]{2})*))\10)?(?:#(?=(?<fragment>(?:[\w-.~!$&'()*+,;=:@/?]|%[\dA-F]{2})*))\11)?$/i;
