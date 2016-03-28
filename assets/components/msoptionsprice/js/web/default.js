    /*Параметры по размерам*/

        
    //var G_price = parseInt(msoptionspricelist.price);     //Цена товара 
    var price = 0;    
    $.each( msoptionsprice, function( key, value ) {
        var ajson = msoptionsprice[key] != "" ? jQuery.parseJSON(msoptionsprice[key]) : {};
      
        $('select[name="options['+key+']"]').change(function() {
            var price = 0; 
            var priceCheched = 0;
            var priceSelect = 0;
            var spval = $(this).val();
            if (spval == 0) return false;
            
            $.each( msoptionsprice, function( key, value ) {
                var ajson = msoptionsprice[key] != "" ? jQuery.parseJSON(msoptionsprice[key]) : {};
                $.each( $('input[name^="options['+key+']"]:checkbox:checked'), function( key, value ) {
                    if ($(this).attr('data-count')) {
                        priceCheched += parseInt(ajson[$(this).val()]['price']) * parseInt($(this).attr('data-count'));
                    } else {
                        priceCheched += parseInt(ajson[$(this).val()]['price']);
                    }
                });
                $.each( $('input[name="options['+key+'][]"]:radio:checked'), function( key, value ) {
                    if (ajson[$(this).val()]) {
                        priceCheched += parseInt(ajson[$(this).val()]['price']);
                    }
                });
                $.each( $('select[name="options['+key+']"] option:selected'), function( key, value ) {
                    if (ajson[$(this).val()]) {
                        priceSelect += parseInt(ajson[$(this).val()]['price']);
                    }
                });
                price = parseInt(priceCheched) + parseInt(priceSelect); 
                
            });
            $('.pr_change').html(parseInt(price));
        });
        
        $('input[name^="options['+key+']"]').change(function() {
            var price = 0;   
            var priceCheched = 0;
            var priceSelect = 0;
            var spval = $(this).val();
            if (spval == 0) return false;
            
            $.each( msoptionsprice, function( key, value ) {
                
                var ajson = msoptionsprice[key] != "" ? jQuery.parseJSON(msoptionsprice[key]) : {};
                
                $.each( $('input[name^="options['+key+']"]:checkbox:checked'), function( key, value ) {
                    if (ajson[$(this).val()]) {
                        if ($(this).attr('data-count')) {
                            priceCheched += parseInt(ajson[$(this).val()]['price']) * parseInt($(this).attr('data-count'));
                        } else {
                            priceCheched += parseInt(ajson[$(this).val()]['price']);
                        }
                    }
                });
                $.each( $('input[name="options['+key+'][]"]:radio:checked'), function( key, value ) {
                    if (ajson[$(this).val()]) {
                        priceCheched += parseInt(ajson[$(this).val()]['price']);
                    }
                });
                $.each( $('select[name="options['+key+']"] option:selected'), function( key, value ) {
                    if (ajson[$(this).val()]) {
                        priceSelect += parseInt(ajson[$(this).val()]['price']);
                    }
                });
                
                price = parseInt(priceCheched) + parseInt(priceSelect); 
            });
            $('.pr_change').html(parseInt(price));
        });
        
        $('span.minus, span.plus').click(function() {
            var input = $(this).closest('.count').find('input[name^="options['+key+']"]');
            
            
            if ( $(this).hasClass("plus") ) {
                $(input).attr('data-count', parseInt(input.attr('data-count')) + parseInt(1));
        	} else if ( $(this).hasClass("minus") ) {
        	    $(input).attr('data-count', parseInt(input.attr('data-count')) - parseInt(1));
        	}
        	
        	if ($(input).attr('data-count') > 0) {
                $(this).closest('.count').find('input[name^="options['+key+']"]').attr('checked', true);
            } else {
                $(this).closest('.count').find('input[name^="options['+key+']"]').attr('checked', false);
            }
            $('input[name^="options['+key+']"]').change();
            
            /*$(this).closest('.count').find('input[name="options['+key+'][]"]').attr('checked', true);
            $('input[name="options['+key+'][]"]').change();*/
            
            //console.log($(this).closest('.count').find('input[name="count"]').val());
            /*if ($(this).closest('.count').find('input[name="count"]').val() > 0) {
                $(this).closest('.count').find('input[name="options['+key+'][]"]').attr('checked', true);
            } else {
                $(this).closest('.count').find('input[name="options['+key+'][]"]').attr('checked', false);
            }*/
        });
        
        
        if (ajson[$('select[name="options['+key+']"] option:selected').val()]) {
            price = parseInt(price) + parseInt(ajson[$('select[name="options['+key+']"] option:selected').val()]['price']);
        }
        
        

    });


    $(document).ready(function() {
        $('.pr_change').html(parseInt(price));
    });
    
    
    /*Параметры по дополнительным параметрам*/
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
/*var ajson = msoptionsprice[msoptionsprice.option] != "" ? jQuery.parseJSON(msoptionsprice[msoptionsprice.option]) : {};



$(document).ready(function() {
    $('.pr_change').html(ajson[$('select[name="options['+msoptionsprice.option+']"] option:selected').val()]);
});*/
