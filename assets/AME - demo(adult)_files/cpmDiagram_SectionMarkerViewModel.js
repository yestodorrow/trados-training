var cpmDiagram = cpmDiagram || {};

(function() {
    
    cpmDiagram.SectionMarkerViewModel = function(sectionMarkerDataModel) {

        this.data = sectionMarkerDataModel;
        this._selected = false;
        this._associatedBranchchoice = null;

        //PROPERTIES
        this.text = function() {
            return this.data.text;
        }

        this.top = function() {
            return this.data.top;
        } 

        
        //
        // Select the section-marker.
        //
        this.select = function() {
            this._selected = true;
        };

        //
        // Select the section-marker.
        //
        this.deselect = function() {
            this._selected = false;
        };

        //
        // return true if selected.
        //
        this.selected = function() {
            return this._selected;
        };

        //
        // Toggle the selection state of the section marker.
        //
        this.toggleSelected = function() {
            this._selected = !this._selected;
        };

        this.SectionMarkerID = function(){
            return "SectionMarker" + this.data.chartSectionMarkerId;
        }

        this.setAssociatedBranchchoice = function(branchchoice) {
            this._associatedBranchchoice = branchchoice;
        }

        this.getAssociatedBranchchoice = function() {
            return this._associatedBranchchoice;
        }

       this.visible = function() {
           if (this._associatedBranchchoice === null) {
               return true;
           }
           var bc = this._associatedBranchchoice;
           var atleastOneCollapsibleConnectorExpanded = false; 
           for (var i in bc.inputConnectors) {
               var conn = bc.inputConnectors[i];
               if (!!conn.data.canCollapse) {
                   if (conn.data.expanded) {
                       atleastOneCollapsibleConnectorExpanded = true;
                       break;
                   }
               }
           }
           return atleastOneCollapsibleConnectorExpanded;
       }

        function Init(){}


        //
        Init();
    }
})();