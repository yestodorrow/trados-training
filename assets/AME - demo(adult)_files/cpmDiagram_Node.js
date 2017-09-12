//
// Template for a node Class.
// nodetype - is an optional parameter. 
// The constructor could be 
//   var node = new cpmDiagram.Node();
//   or
//   var node = new cpmDiagram.Node(nodetype);
cpmDiagram.Node=function(nodetype) {

    return {
        name: '',
        id: '',
        nodeType: 0,
        x: 248,
        y: 23,
        nodeWidth: 250,
        nodeHeight: 120,
        inputConnectors: [
            {
               name: "A",
               expanded: true
            },
            {
                name: "B",
                expanded: true
            },
            {
                name: "C",
                expanded: true
            },
            {
                name: "D",
                expanded: true
            }
        ],
        outputConnectors: [],
        relatedContentItems:[]
    }
};