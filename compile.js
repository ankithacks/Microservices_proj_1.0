function lexer(input){
    const tokens=[];
    let cursor=0;

    while(cursor < input.length){
        let char=input[cursor];  //ttaking input of the current character
        // skip if there is a whitespace encountered:-
        if(/\s/.test(char)){
            cursor++;
            continue;
        }


        if(/[a-zA-Z]/.test(char)){
            let word=''
            while(/[a-zA-Z0-9]/.test(char)){
                word += char;
                char=input[++cursor]
            }
            
            // agar keyword hain then push it inside the token
            if(word==='ye' || word == 'bol'){
                tokens.push({type: 'keyword', value: word})
            }
            // else if its not a keyword then its a variable:-
            else{
                tokens.push({type: 'identifier', value: word})
            }
            continue;
        }
        if(/[0-9]/.test(char)){
            let num=''
            while(/[0-9]/.test(char)){
                num+=char
                char=input[++cursor]
            }
            tokens.push({type: 'number', value: parseInt(num)})
            continue;
        }

        // tokenize the operators and equals sign:-
    if(/[\+\-\*/=]/.test(char)){
        tokens.push({type: 'operator', value: char})
        cursor++;
        continue;
    }
    }
    return tokens
}

function parser(tokens){
    const ast={
        type: 'Program',
        body:[]
    };
    while(tokens.length > 0){
        let token=tokens.shift(); //pehela token uthaya ye
        if(token.type === 'keyword' && token.value === 'ye'){
            let declaration={
                type: 'Declaration',
                name: tokens.shift().value,
                value: null
            }

            // check for the assignment:-
            if(tokens[0].type === 'operator' && tokens[0].value==='='){
                tokens.shift();  //consume '='
                // parse the expression:-
                let expression='' // example 10+40 is an expression
                while(tokens.length > 0 && tokens[0].type !== 'keyword'){
                    expression += tokens.shift().value;
                }
                declaration.value=expression.trim()
            }
            ast.body.push(declaration)
        }
        if(token.type==='keyword' && token.value === 'bol'){
            ast.body.push({
                type: 'Print',
                expression: tokens.shift().value
            })
        }
    }
    return ast;
}

function codeGenerator(node){
    switch(node.type){
        case 'Program':
            return node.body.map(codeGenerator).join('\n')
        case 'Declaration':
            return `const ${node.name}= ${node.value}`
        case 'Print':
            return `console.log(${node.expression})`
    }
}

function compiler(input){
    const tokens=lexer(input)
    const ast=parser(tokens)
    const executable=codeGenerator(ast)
    // console.log(tokens)
    // console.log(ast)
    // console.log(executable)
    return executable
}

function runner(input){
    eval(input)
}


const code=`
ye x = 10
ye y = 60

ye sum = x+y
bol sum
`

const exec=compiler(code)
runner(exec)