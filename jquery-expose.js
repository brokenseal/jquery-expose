/*
    Expose DOM elements with ease
    
    Author: Davide Callegari - http://www.brokenseal.it/
    Home page: http://github.com/brokenseal/jquery-expose/
    
    License: MIT
*/

;(function($){
    var
        defaultOptions= {
            dark: true                            // light or dark exposer
            ,mainElement: 'body'                // main element where to append the exposer
        }
        ,$window= $(window)
        
        // cloning is faster than creating
        ,exposer= $('<div class="ui-expose-exposer" style="display:none;"></div>')
        
        // private methods
        ,expose= function(options, exposed, exposer){
            var
                placeholder= exposed.clone()
                ,unExposeHandler= function(){
                    
                    // un-expose the element
                    unExpose(options, exposed, exposer, placeholder);
                    
                    // unbind the esc key press from the page for this handler
                    $window.unbind('keypress, keydown, keyup', escKeypressHandler);
                    
                }
                ,escKeypressHandler= function(e){
                    if(e.keyCode == 27) {
                        unExposeHandler();
                    }
                }
            ;
            
            // save the original style for later use
            exposed.each(function(){
                this.exposeStyle= $(this).attr('style');
            });
            
            // force the layout of the exposed element to be what we expect it to be
            exposed.css({
                left: exposed.position().left
                ,top: exposed.position().top
                ,width: exposed.width()
            });
            
            // place the placeholder to let the original layout of the page intact
            exposed.before(placeholder);
            
            // highlitght the exposed element
            exposed.addClass('ui-expose-exposed');
            
            // append the exposer to the main selected element
            exposer.prependTo(options.mainElement);
            
            // fade the exposer in and bind the unexpose function to it
            exposer.fadeIn();
            exposer.click(function(){
                unExposeHandler();
            });
            
            // un-expose the element on 'esc' key press
            $window.bind('keypress, keydown, keyup', escKeypressHandler);
        }
        ,unExpose= function(options, exposed, exposer, placeholder){
            
            // fade out the exposer
            exposer.fadeOut(function(){
                
                // remove the placeholder from the DOM
                placeholder.remove();
                
                // un-highlight the exposed element
                exposed.removeClass('ui-expose-exposed');
                
                // reset the layout of the exposed element to the original values
                exposed.each(function(){
                    $(this).attr('style', this.exposeStyle || '');
                    delete this.exposeStyle;
                });
                
                // remove the saved layout values from the DOM object
                delete exposed.expose;
            });
        }
    ;
    
    // the main plugin function
    $.fn.expose= function(options){
        var
            newExposer= exposer.clone()
        ;
        
        // merge provided options with default options
        options= $.fn.extend(defaultOptions, options);
        
        options.dark ? newExposer.addClass('ui-expose-dark') : newExposer.addClass('ui-expose-light');
        
        return this.each(function(){
            var
                element= $(this)
            ;
            
            expose(options, element, newExposer);
        });
    };
})(jQuery);
