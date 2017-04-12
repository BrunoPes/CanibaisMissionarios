let ansVet = [];
const startState = {l:{c: 3, m: 3}, r: {c: 0, m: 0}, side:false};
const endState   = {l:{c: 0, m: 0}, r: {c: 3, m: 3}, side:true};

function getNode(state, parent) {
    let children = [];
    const addChild = node => { children.push(node); };
    const removeChild = index => { children.splice(index, 1); };
    return {state: state, parent: parent, children, addChild, removeChild};
}

createChildNodes = (parent) => {
    let validAction = false;
    let states = [];
    let state  = parent.state;
    let mis, misAux = !state.side ? state.l.m : state.r.m;
    let can, canAux = !state.side ? state.l.c : state.r.c;

    if((canAux - 1) >= 0 && (misAux - 1) >= 0) {
        can = canAux - 1;
        mis = misAux - 1;
        states.push(!state.side ? {l:{c: can, m: mis}, r:{c: 3-can, m: 3-mis}, side: true} : {l:{c: 3-can, m: 3-mis}, r:{c: can, m: mis}, side: false});
    }
    if((canAux - 2) >= 0) {
        can = canAux - 2;
        mis = misAux;
        states.push(!state.side ? {l:{c: can, m: mis}, r:{c: 3-can, m: 3-mis}, side: true} : {l:{c: 3-can, m: 3-mis}, r:{c: can, m: mis}, side: false});
    }
    if((canAux - 1) >= 0) {
        can = canAux - 1;
        mis = misAux;
        states.push(!state.side ? {l:{c: can, m: mis}, r:{c: 3-can, m: 3-mis}, side: true} : {l:{c: 3-can, m: 3-mis}, r:{c: can, m: mis}, side: false});
    }
    if((misAux - 2) >= 0) {
        can = canAux;
        mis = misAux - 2;
        states.push(!state.side ? {l:{c: can, m: mis}, r:{c: 3-can, m: 3-mis}, side: true} : {l:{c: 3-can, m: 3-mis}, r:{c: can, m: mis}, side: false});
    }
    if((misAux - 1) >= 0) {
        can = canAux;
        mis = misAux - 1;
        states.push(!state.side ? {l:{c: can, m: mis}, r:{c: 3-can, m: 3-mis}, side: true} : {l:{c: 3-can, m: 3-mis}, r:{c: can, m: mis}, side: false});
    }
    states.forEach((ele, i) => {
        if(isStateValid(ele, ansVet)) {
            ansVet.push(ele);
            parent.addChild(getNode(ele, parent));
        }
    });
}

isStateValid = (state, vector) => {
    let canLft = state.l.c;
    let misLft = state.l.m;
    let canRgt = state.r.c;
    let misRgt = state.r.m;
    let existInVector = vector.find((ele, i) => {
        return (ele.l.c == canLft && ele.l.m == misLft && ele.r.c == canRgt && ele.r.m == misRgt && ele.side == state.side);
    });

    return (existInVector == null && ((canLft <= misLft) || (canLft - misLft == canLft)) && ((canRgt <= misRgt) || (canRgt - misRgt == canRgt)));
}

start = _ => {
    let rootNode = getNode(startState, false, null);
    ansVet = [rootNode.state];
    dfs(rootNode);
}

dfs = node => {
    if(node.state.l.c == endState.l.c && node.state.l.m == endState.l.m){
        let aux = node;
        let answer = [];
        console.log("RESPOSTA: ");
        while(aux != null) {            
            aux && answer.push(aux);
            aux = aux.parent;
        }
        for(let i=(answer.length-1); i >= 0; i--) {
            aux = answer[i];
            aux && console.log("Margem Esq: ", aux.state.l, "  Margem Dir: ", aux.state.r, "Lado Barco: " + (aux.state.side ? "Dir":"Esq"));
        }
        return 0;
    }

    createChildNodes(node);
    if(node.children.length <= 0) {
        node = null;
    } else {
        while(node.children.length > 0) {
            if(dfs(node.children[0]) == 0) {
                return 0;
            } else {
                node.removeChild(0);
                let index = ansVet.length;
                ansVet.find((ele, i) => {
                    left  = node.state.l;
                    right = node.state.r;
                    if(ele.l.c == left.c && ele.l.m == left.m)
                        index = i;
                });
                ansVet.splice(index, 1);
            }
        }
    }
    return 1;
}