//===== Dot =====

//valid
/./u;
/a.c/u;


//===== Boundary Assertions =====

//valid
/^foobar$/u;
/\bfoo\Bbar/u;


//===== Special Escapes =====

//valid
/\f\n\r\t\v/u;
/[\f\n\r\t\v]/u;
/[\b]/u;	//backspace
/\0/u;
/[\0]/u;
/\0_/u;
/[\0_]/u;

//invalid
/\00/u;
/\000/u;
/\01/u;
/\07/u;
/\09/u;
/[\00]/u;
/[\000]/u;
/[\01]/u;
/[\07]/u;
/[\09]/u;
/\00_/u;
/\000_/u;
/\01_/u;
/\07_/u;
/\09_/u;
/[\00_]/u;
/[\000_]/u;
/[\01_]/u;
/[\07_]/u;
/[\09_]/u;


//===== Control Letter Escapes =====

//valid
/\ca/u;
/[\ca]/u;
/\ca_/u;
/[\ca_]/u;

//invalid
/\c/u;
/\c9/u;
/[\c]/u;
/[\c9]/u;
/\c_/u;
/\c9_/u;
/\c\t_/u;
/[\c_]/u;
/[\c9_]/u;
/[\c\t_]/u;


//===== Hexadecimal Escapes =====

//valid
/\xff/u;
/[\xff]/u;
/\xff_/u;
/[\xff_]/u;

//invalid
/\x/u;
/\xf/u;
/\xz/u;
/[\x]/u;
/[\xf]/u;
/[\xz]/u;
/\x_;/u;
/\xf_;/u;
/\xfz;/u;
/\xz;/u;
/\x\t;/u;
/[\x_;]/u;
/[\xf_;]/u;
/[\xfz;]/u;
/[\xz;]/u;
/[\x\t;]/u;


//===== Unicode Escapes =====

//valid
/\uffff/u;
/[\uffff]/u;
/\uffff_/u;
/[\uffff_]/u;

//invalid
/\u/u;
/\uf/u;
/\uz/u;
/[\u]/u;
/[\uf]/u;
/[\uz]/u;
/\u_;/u;
/\uf_;/u;
/\uz;/u;
/[\u_]/u;
/[\u_;]/u;
/[\uf_]/u;
/[\uf_;]/u;
/[\uz_]/u;


//===== Unicode Code Point Escapes =====

//valid
/\u{f}/u;
/\u{fffff}/u;
/\u{10ffff}/u;
/[\u{f}]/u;
/[\u{fffff}]/u;
/[\u{10ffff}]/u;
/\u{f}_/u;
/\u{fffff}_/u;
/\u{10ffff}_/u;
/[\u{f}_]/u;
/[\u{fffff}_]/u;
/[\u{10ffff}_]/u;

//invalid
/\u{/u;
/\u{}/u;
/\u{f/u;
/\u{z/u;
/\u{fffff0/u;
/[\u{]/u;
/[\u{}]/u;
/[\u{f]/u;
/[\u{z]/u;
/[\u{fffff0]/u;
/\u{_/u;
/\u{_z/u;
/\u{}_z;;/u;
/\u{f;;/u;
/\u{fz;/u;
/\u{fz/u;
/\u{z;/u;
/\u{fffff0;/u;
/[\u{_]/u;
/[\u{_;]/u;
/[\u{}_]/u;
/[\u{f_]/u;
/[\u{f_;]/u;
/[\u{z;]/u;
/[\u{fffff0;]/u;


//===== Identity Escapes =====

//valid
/ \^\$\\\.\*\+\?\(\)\[\]\{\}\|\//u;
/[\^\$\\\.\*\+\?\(\)\[\]\{\}\|\/]/u;
/[\-]/u;

//invalid
/\-/u;
/\a/u;	//escaping any non-syntax character is invalid
/[\a]/u;
/\a_/u;
/[\a_]/u;


//===== Character Class Escapes =====

//valid
/\d\D\s\S\w\W/u;
/[\d\D\s\S\w\W]/u;


//===== Unicode Property Escapes =====

/\p{Decimal_Number} \P{Decimal_Number}/u;
/[\p{Decimal_Number} \P{Decimal_Number}]/u;
/\p{General_Category=Decimal_Number} \P{General_Category=Decimal_Number}/u;
/[\p{General_Category=Decimal_Number} \P{General_Category=Decimal_Number}]/u;

//invalid
/\p/u;
/\p{/u;
/\p{}/u;
/\p{a/u;
/\p{a=/u;
/\p{a=b/u;
/\p{=b/u;
/\p{=/u;
/\p{=b}/u;
/\p{=}/u;
/[\p]/u;
/[\p{]/u;
/[\p{}]/u;
/[\p{a]/u;
/[\p{a=]/u;
/[\p{a=b]/u;
/[\p{=b]/u;
/[\p{=]/u;
/[\p{=b}]/u;
/[\p{=}]/u;
/\p;;/u;
/\p{;;/u;
/\p{};/u;
/\p{a;;/u;
/\p{a=;;/u;
/\p{a=b;;/u;
/\p{=b;/u;
/\p{=;/u;
/\p{=b};/u;
/\p{=};/u;
/[\p;]/u;
/[\p{;;]/u;
/[\p{};]/u;
/[\p{a;;]/u;
/[\p{a=;;]/u;
/[\p{a=b;;]/u;
/[\p{=b;]/u;
/[\p{=;]/u;
/[\p{=b};]/u;
/[\p{=};]/u;


//===== Character Sets =====

//valid
/[]/u;
/[foo]/u;
/[^foo]/u;
/[foo^]/u;
/[\b]/u;	//special escape for backspace
/[\-]/u;	//identity escape for '-'
/[a-z]/u;
/[a-a]/u;
/[\t-a]/u;
/[\t-\t]/u;
/[a-\uffff]/u;
/[a-\u{ffff}]/u;
/[a-\d]/u;
/[\d-a]/u;
/[\d-\d]/u;
/[-]/u;
/[--]/u;
/[---]/u;
/[-a-b-c-]/u;
/[/]/u;
/[\^\$\\\.\*\+\?\(\)\[\]\{\}\|\/\-]/u;

//invalid
/[a-\x]/u;
/[\x-z]/u;
/[z-a]/u;	//range out of order
/[a-\t]/u;	//range out of order
new RegExp('[', 'u');
/a]a/u;


//===== Groups and Lookaround Assertions =====

//Note: Tree-sitter doesn't support Unicode property escapes, so I can't reasonably make this part match the spec.

//valid
/()/u;
/(foo)/u;
/(?:)/u;
/(?:foo)/u;
/(?=)/u;
/(?=foo)/u;
/(?!foo)/u;
/(?<=foo)/u;
/(?<!foo)/u;
/(?<foo>)/u;
/(?<foo>bar)/u;
/(?<aA0_$\u0066oo>bar)/u;
/(?<aa\u0066>bar)/u;
/(?<aaa\u0066>bar)/u;
/(a*)/u;

//invalid
/(?<foo>a)(?<foo>b)/u;	//duplicate group name
/(?<>bar)/u;
/(?<;>bar)/u;
/(?<a;b;c>bar)/u;
/(?<#/u;
/(?<a/u;
/(?<#)/u;
/(?<a)/u;
/(?<#>bar)/u;
/(?<a\u>bar)/u;
/(?<a\u0>bar)/u;
/(?<\uf>bar)/u;
/(?<\t>bar)/u;
/(?<#a;/u;
/(?<aa;/u;
/(?<#a;);/u;
/(?<a;);/u;
/(?<a>b/u;
/(a/u;
/(?:a/u;
/(?=a/u;
/(?!a/u;
/(?<=a/u;
/(?<!a/u;
/(?_/u;
/(?a(?:b)/u;
/(?a(?:b)c)/u;
/(?:a(?b)c)/u;
/(?:a))(?<#)(?<#(?:a/u;
/(?:a))(?<#)(?<#(?:a)/u;
/(a(b/u;
/(a(b)c/u;
/(?:a(?:b)c/u;
/(a(b(c)d(e)f/u;
/(a(b(c)d(e)f)g/u;
/(?=a)(?=b/u;
/a);/u;
/a(b)c)d/u;
/a)((a*)/u;
/a(*a/u;
/a(_*a/u;
/a)*a/u;
/a)_*a/u;
/(foo|bar)/u;


//===== Backreferences =====

//valid
/\1\9\10\999/u;
/\k<foo>/u;
/\k<aA0_$\u0066oo>/u;
/\k<\u0066>/u;
/\k<\u0066oo>/u;
/\k<aa\u0066>/u;
/\k<aaa\u0066>/u;

//invalid
/\k/u;
/\k</u;
/\k<;/u;
/\k<a/u;
/\k<\u/u;
/\k<\uf/u;
/\k<\u0066/u;
/\k<\u0066oo/u;
/\k<\t/u;
/\k;/u;
/\k<;;/u;
/\k<a;;/u;
/\k<\u;;/u;
/\k<\uf;;/u;
/\k<\u0066;;/u;
/\k<\u0066oo;;/u;
/\k<\t;/u;
/\k<>/u;
/\k<;>/u;
/\k<\u>/u;
/\k<\uf>/u;
/\k<\t>/u;
/\k<>;/u;
/\k<;>;/u;
/\k<;;>;/u;
/\k<\uf;>;/u;
/\k<\t>;/u;


//===== Disjunction =====

//valid
/foo|bar/u;
/(foo|bar)/u;
/|/u;
/a||b/u;


//===== Quantifiers =====

//valid
/a?_/u;
/a*_/u;
/a+_/u;
/a??_/u;
/a*?_/u;
/a+?_/u;
/a{1}_/u;
/a{1,}_/u;
/a{1,2}_/u;
/a{1}?_/u;
/a{1,}?_/u;
/a{1,2}?_/u;
/\?*/u;

//invalid
/a{/u;
/a{z/u;
/a{z_/u;
/a{}_/u;
/a{z}_/u;
/a{z_}_/u;
/a{1/u;
/a{1z/u;
/a{1z_/u;
/a{1,_/u;
/a{1,2_/u;
/a{1z_}_/u;
/a{,2}_/u;
/a{,_}_/u;
/a?{/u;
/a?{z/u;
/a?{z_/u;
/a?{z_}_/u;
/a?{1/u;
/a?{1z/u;
/a?{1z_/u;
/a?{1z_}_/u;
/a?{,2}_/u;
/a?{,_}_/u;
/a{a/u;
/a}a/u;

//invalid
new RegExp('*', 'u');
/+_/u;
/?_/u;
/a?*_/u;
/a?+_/u;
/a**_/u;
/a*+_/u;
/a+*_/u;
/a++_/u;
/a{1}*_/u;
/a{1}+_/u;
/a???_/u;
/a??*_/u;
/a??+_/u;
/a*??_/u;
/a*?*_/u;
/a*?+_/u;
/a+??_/u;
/a+?*_/u;
/a+?+_/u;
/a{1}??_/u;
/a{1}?*_/u;
/a{1}?+_/u;
/a?{1}_/u;
/a*{1}_/u;
/a+{1}_/u;
/a{1}{1}_/u;
/a??{1}_/u;
/a*?{1}_/u;
/a+?{1}_/u;
/a{1}?{1}_/u;
/a(*a/u;
/a)*a/u;


//===== Examples =====

//URI-matching RegExp ( https://github.com/wizard04wsu/URI_Parsing )
/^(?=(?<scheme>[a-z][a-z\d+.-]*))\1:(?:\/\/(?<authority>(?:(?=(?<userinfo>(?:[\w-.~!$&'()*+,;=:]|%[\dA-F]{2})*))\3@)?(?=(?<host>\[[\dA-F:.]{2,}\]|(?:[\w-.~!$&'()*+,;=]|%[\dA-F]{2})*))\4(?::(?=(?<port>\d*))\5)?)(?<path1>\/(?=((?:[\w-.~!$&'()*+,;=:@/]|%[\dA-F]{2})*))\7)?|(?<path2>\/?(?!\/)(?=((?:[\w-.~!$&'()*+,;=:@/]|%[\dA-F]{2})*))\9)?)(?:\?(?=(?<query>(?:[\w-.~!$&'()*+,;=:@/?]|%[\dA-F]{2})*))\10)?(?:#(?=(?<fragment>(?:[\w-.~!$&'()*+,;=:@/?]|%[\dA-F]{2})*))\11)?$/ui;
