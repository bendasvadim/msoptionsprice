Ext.onReady(function() {
    var mainPanel = Ext.getCmp('modx-panel-resource')
    data = mainPanel.config.record,
        panelRight = Ext.getCmp('modx-resource-main-right'),
        tabpanel = Ext.getCmp('minishop2-product-settings-panel'),
        msoptionsprice_field = {

            xtype: 'numberfield',
            decimalPrecision: 2,
            value: '',
            name: 'msoptionsprice[]',
            fieldLabel: '',
            anchor: '40%',
            enableKeyEvents: true,
            listeners: {

                keyup: function() {

                    //console.log('клавиша');
                    var cmp = Ext.getCmp('modx-action-buttons');
                        if (cmp) {
                            for (var i in cmp.items.items) {
                                var el = cmp.items.items[i];
                                if ('button' == el.xtype && 'update' == el.process) {
                                    el.enable();
                                }
                            }
                        }

                },
            },

        },
        msoptionsphoto_field = {

            xtype: 'minishop2-combo-browser',
            value: '',
            html: '',
            name: 'msoptionsphoto[]',
            fieldLabel: '',
            anchor: '100%',
            enableKeyEvents: true,
            listeners: {

                keyup: function() {

                    //console.log('клавиша');
                    var cmp = Ext.getCmp('modx-action-buttons');
                        if (cmp) {
                            for (var i in cmp.items.items) {
                                var el = cmp.items.items[i];
                                if ('button' == el.xtype && 'update' == el.process) {
                                    el.enable();
                                }
                            }
                        }

                },
            },

        },
        /*msoptionsphoto_view_field = {
            xtype: 'displayfield',
            fieldLabel: '',
            anchor: '100%',
            html: 'Превью',

        },*/
        
        msoptionsprice_no = {

            html: _('msoptionsprice_intro_msg_no'),
            border: false,
            bodyStyle: 'background-color: #fff;margin: 16px 15px 20px 0;'


        },

        index = 1;
            
        var ms_op_options = msoptionsprice.Config.ms_op_options;
        
        var params = ms_op_options.split(',');
        
        // display the result in myDiv
        for(var op=0;op<params.length;op++){
            tabpanel.add({
                title: 'Парметры: '+params[op],
                id: 'modx-msoptionsprice-tabs'+params[op],
                enableToggle  : true,
                items: [{
            		xtype: 'modx-tabs'
            		,id: 'minishop2-orders-tabs_'+params[op]
            		,bodyStyle: 'padding: 10px'
            		,defaults: { border: false ,autoHeight: true }
            		,border: true
            		,hideMode: 'offsets'
            		,items: [{
            			title: params[op]
            			,items: [{
            				html: _('msoptionsprice_intro_msg')
            				,border: false
            				,bodyCssClass: 'panel-desc'
            				//,bodyStyle: 'margin-bottom: 10px'
            			},{
            				xtype: 'fieldset'
            				,id: 'modx-resource-msoptions_'+params[op]
            				,layout: 'column'
            				,style: 'padding:15px 5px;text-align:center;'
            				,defaults: {msgTarget: 'under',border: false}
            				,items: [{
            					columnWidth: .5
            					,layout: 'form'
            					,items: [
            						{
                                        xtype: 'panel',
                                        border: false,
                                        layout: 'form',
                                        labelAlign: 'top',
                                        id: 'modx-resource-msoptionsprice_'+params[op],
                                        preventRender: true,
            						}
            					]
            				},{
            					columnWidth: .5
            					,layout: 'form'
            					,items: [
            						{
            						    xtype: 'panel',
                                        border: false,
                                        layout: 'form',
                                        labelAlign: 'top',
                                        id: 'modx-resource-msoptionsphoto_'+params[op],
                                        preventRender: true,
            						}
            					]
            				}/*,{
            					columnWidth: .2
            					,layout: 'form'
            					,items: [
            						{
            						    xtype: 'panel',
                                        border: false,
                                        layout: 'form',
                                        labelAlign: 'top',
                                        id: 'modx-resource-msoptionsphoto_view_'+params[op],
                                        preventRender: true,
            						}
            					]
            				}*/]
            			}]
            		}]
            	}]
        
            });
            
            
            
            var photo = Ext.getCmp('modx-resource-msoptionsphoto_'+params[op]);
            var panel = Ext.getCmp('modx-resource-msoptionsprice_'+params[op])
          
          
            var size = data[params[op]];
        
            
            if (data.properties === null) {
                data.properties = msoptionsprice;
            }
        
            if ((size.length == 0)) {
                panel.add(msoptionsprice_no);
            }
            if ((size.length == 1)) {
                msoptionsprice_no.html = _('msoptionsprice_intro_msg_1');
                panel.add(msoptionsprice_no);
            }
            
            
            if ((typeof data.properties['msoptionsprice_'+params[op]] === 'object')) {
        
                var sizeprice = data.properties['msoptionsprice_'+params[op]];
                
                for (var i = 0; i < size.length; i++) {
                    msoptionsprice_field.value = sizeprice[size[i].value]['price'] || 0;
                    msoptionsprice_field.fieldLabel = 'Цена за '+size[i].value; //ms_op_options
                    msoptionsprice_field.name = 'msoptionsprice_'+params[op]+'[' + size[i].value + ']';
                    panel.add(msoptionsprice_field);
                    
                    msoptionsphoto_field.value = sizeprice[size[i].value]['photo'] || '';
                    msoptionsphoto_field.fieldLabel = 'Фото'; //ms_op_options
                    msoptionsphoto_field.name = 'msoptionsphoto_'+params[op]+'[' + size[i].value + ']';
                    //msoptionsphoto_field.renderer = this.renderLogo;
                    photo.add(msoptionsphoto_field);
                    
                    
                    /*if ((sizeprice[size[i].value]['photo'].length > 0)) {
                        msoptionsphoto_view_field.html = '<img src="/'+sizeprice[size[i].value]['photo']+'" height="80" />';
                        panel.add(msoptionsphoto_view_field);
                    }*/
                    
                    
                    index += 1;
                }
        
                panel.doLayout();
                msoptionsprice_field.value = '';
                msoptionsprice_field.openTo = '';
            }
        
            if (!data.properties['msoptionsprice_'+params[op]] && (size.length > 1)) {
        
                for (var i = 0; i < size.length; i++) {
                    msoptionsprice_field.value = 0;
                    msoptionsprice_field.fieldLabel = 'Цена за '+size[i].value;
                    msoptionsprice_field.name = 'msoptionsprice_'+params[op]+'[' + size[i].value + ']';
                    panel.add(msoptionsprice_field);
                    
                    msoptionsphoto_field.value = '';
                    msoptionsphoto_field.fieldLabel = 'Фото';
                    msoptionsphoto_field.name = 'msoptionsphoto_'+params[op]+'[' + size[i].value + ']';
                    photo.add(msoptionsphoto_field);
                    
                    
                    index += 1;
                }
        
            }
    
            
        }
        
       /* renderLogo: function(value) {
    		if (/(jpg|png|gif|jpeg)$/i.test(value)) {
    			if (!/^\//.test(value)) {value = '/' + value;}
    			return '<img src="'+value+'" height="35" />';
    		}
    		else {
    			return '';
    		}
    	}*/
        
});

