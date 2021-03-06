<?php
/**
 * The base class for msOptionsPrice.
 */

class msOptionsPrice {
	/* @var modX $modx */
	public $modx;
	public $namespace = 'msoptionsprice';
	public $cache = null;
	public $config = array();
	public $ms_op_options;
	public $ms_op_active = false;

	/**
	 * @param modX $modx
	 * @param array $config
	 */
	function __construct(modX &$modx, array $config = array()) {
		$this->modx =& $modx;

		$this->namespace = $this->getOption('namespace', $config, 'msoptionsprice');
		$corePath = $this->modx->getOption('msoptionsprice_core_path', $config, $this->modx->getOption('core_path') . 'components/msoptionsprice/');
		$assetsUrl = $this->modx->getOption('msoptionsprice_assets_url', $config, $this->modx->getOption('assets_url') . 'components/msoptionsprice/');
		$connectorUrl = $assetsUrl . 'connector.php';

		$this->config = array_merge(array(
			'assetsUrl' => $assetsUrl,
			'cssUrl' => $assetsUrl . 'css/',
			'jsUrl' => $assetsUrl . 'js/',
			'imagesUrl' => $assetsUrl . 'images/',
			'connectorUrl' => $connectorUrl,

			'corePath' => $corePath,
			'modelPath' => $corePath . 'model/',
			'chunksPath' => $corePath . 'elements/chunks/',
			'templatesPath' => $corePath . 'elements/templates/',
			'chunkSuffix' => '.chunk.tpl',
			'snippetsPath' => $corePath . 'elements/snippets/',
			'processorsPath' => $corePath . 'processors/'
		), $config);

		//$this->modx->addPackage('msoptionsprice', $this->config['modelPath']);
		$this->modx->lexicon->load('msoptionsprice:default');
		$this->ms_op_options = $this->modx->getOption('msoptionsprice_ms_op_options', $config, null);
		$this->ms_op_active = $this->modx->getOption('msoptionsprice_ms_op_active', $config, false);
	}

	public function getOption($key, $config = array(), $default = null) {
		$option = $default;
		if (!empty($key) && is_string($key)) {
			if ($config != null && array_key_exists($key, $config)) {
				$option = $config[$key];
			} elseif (array_key_exists($key, $this->config)) {
				$option = $this->config[$key];
			} elseif (array_key_exists("{$this->namespace}.{$key}", $this->modx->config)) {
				$option = $this->modx->getOption("{$this->namespace}.{$key}");
			}
		}
		return $option;
	}

	public function onDocFormPrerender($scriptProperties,$product = 0) {

		$mode = $this->modx->getOption('mode', $scriptProperties);
		$this->modx->controller->addLexiconTopic('msoptionsprice:default');//

		if ($mode == 'upd') {

			$config_js = preg_replace(array('/^\n/', '/\t{6}/'), '', '
					msoptionsprice = {};
					msoptionsprice.Config = {
						ms_op_options: "'.$this->ms_op_options.'"
						};
					');
			$this->modx->regClientStartupScript("<script type=\"text/javascript\">\n".$config_js."\n</script>", true);

			$res = $this->modx->getObject("modResource",$scriptProperties['id']);
			if ( $res && ($res->get("class_key")=="msProduct") ){
				$this->modx->regClientStartupScript($this->getOption('jsUrl').'mgr/inject/tab.js');
			}
//			print_r($scriptProperties['properties']);
		}

	}

	public function OnBeforeDocFormSave($scriptProperties,$product = 0) {

		$mode = $this->modx->getOption('mode', $scriptProperties);

		if ($mode == 'upd') {

			$res = $this->modx->getObject("modResource",$scriptProperties['id']);
			if ($res->get("class_key")=="msProduct") {
				foreach (explode(",", $this->ms_op_options) as $value) {
				    $price = [];
				    $data = [];
				    foreach ($_POST[$value] as $v) {
				        $price[$v] = array(
				                    "price" => $_POST['msoptionsprice_'.trim($value)][$v],
                    			    "photo" => $_POST['msoptionsphoto_'.trim($value)][$v]
				                    );
				    }
					
					if (isset($price) && (count($price) > 0)) {
						$res->setProperties($price,'msoptionsprice_'.trim($value),false);
						$res->save();
					}
					
					/*if (isset($_POST['msoptionsprice_'.trim($value)]) && (count($_POST['msoptionsprice_'.trim($value)]) > 0)) {
						$msoptionsprice = $this->prepareArray($_POST['msoptionsprice_'.trim($value)]);
						
						$res->setProperties($msoptionsprice,'msoptionsprice_'.trim($value),false);
						//$res->save();
					}*/

				}
				

			}

		}

	}

	public function msOnBeforeAddToCart($scriptProperties,$product = 0) {

        foreach (explode(",", $this->ms_op_options) as $value) {
    		    
            if (!empty($scriptProperties['options'][$value]))
    		{
    		    if (is_array($scriptProperties['options'][$value])) {
    		        foreach ($scriptProperties['options'][$value] as $v) {
    		            
    		            
            			$id = $product->get('id');
            			$res = $this->modx->getObject("modResource",$id);
            			$properties = $res->get('properties');
                        
            		    if (count($v) > 1) {
            		        $new_price += $properties['msoptionsprice_'.$value][$v['value']]['price'] * $v['count'];
            		    } else {
            		        $new_price += $properties['msoptionsprice_'.$value][$v]['price'];
            		    }
            			
    		        }
    		    } else {
        			$size = $scriptProperties['options'][$value];
                    
        
        			$id = $product->get('id');
        			$res = $this->modx->getObject("modResource",$id);
        			$properties = $res->get('properties');
                    
        		    
        			$new_price += $properties['msoptionsprice_'.$value][$size]['price'];
    		    }
    		}
        }
        
        if (isset($new_price)) $product->set('price', $new_price);
        /*if (isset($new_price)) $product->set('price', $new_price + $product->get('price'));*/


		/*if (!empty($scriptProperties['options'][$this->ms_op_options]))
		{
			$size = ($scriptProperties['options'][$this->ms_op_options]);

			$id = $product->get('id');
			$res = $this->modx->getObject("modResource",$id);
			$properties = $res->get('properties');

			$new_price = $properties['msoptionsprice'][$size];

			if (isset($new_price)) $product->set('price', $new_price);
		}*/

	}

	public function OnLoadWebDocument($scriptProperties,$product = 0) {
				
		if ($this->modx->resource->class_key !== "msProduct") {return;}

		$arr = $this->modx->fromJSON($this->modx->resource->properties);
		
		

		foreach (explode(",", $this->ms_op_options) as $key => $value) {
			
			if ( !empty($arr['msoptionsprice_'.trim($value)]) && (count($arr['msoptionsprice_'.trim($value)]) > 1) ) {
				
				
				//$this->modx->log(modX::LOG_LEVEL_ERROR, print_r(), true));
				/*foreach ($arr[['msoptionsprice_'.trim($value)]] as $k => &$v) {
					$arr[['msoptionsprice_'.trim($value)]][$k] = $this->formatPrice($v) ;
				}*/
				
			$msoptionsprice .= trim($value).': \''.$this->modx->toJSON($arr['msoptionsprice_'.trim($value)]).'\',';
						
				
			}
			
		}
		$this->modx->regClientStartupScript(preg_replace('/(\t|\n)/', '', '
						<script type="text/javascript">
							msoptionsprice = {' .$msoptionsprice. '}
						</script>
				'), true);
				
				
		
		$msoptionspricelist = preg_replace('/(\t|\n)/', '', '
					msoptionspricelist = {
						option: \''.$this->ms_op_options.'\',
						price: \''.$this->modx->resource->get('price').'\'
					};
				');
				
		$this->modx->regClientStartupScript(preg_replace('/(\t|\n)/', '', '
				<script type="text/javascript">
					' .$msoptionspricelist. '
				</script>
		'), true);
		
		$this->modx->regClientScript(str_replace('[[+assetsUrl]]', $this->config['assetsUrl'], $this->modx->getOption('msoptionsprice_ms_op_front_js', $config, null)));
		
		/*$this->modx->regClientStartupScript(preg_replace('/(\t|\n)/', '', '
				<script type="text/javascript">
					' .$msoptionsprice. '
				</script>
		'), true);

		$this->modx->regClientScript(str_replace('[[+assetsUrl]]', $this->config['assetsUrl'], $this->modx->getOption('msoptionsprice_ms_op_front_js', $config, null)));*/
		/*if ( !empty($arr) && (count($arr['msoptionsprice']) > 1) ) {

			foreach ($arr['msoptionsprice'] as $k => &$v) {
				$arr['msoptionsprice'][$k] = $this->formatPrice($v) ;
			}
			$arr = $this->modx->toJSON($arr['msoptionsprice']);

			$msoptionsprice = preg_replace('/(\t|\n)/', '', '
						msoptionsprice = {
							option: "'.$this->ms_op_options.'",
							'.$this->ms_op_options.': \''.$arr.'\'
						};
					');
			$this->modx->regClientStartupScript(preg_replace('/(\t|\n)/', '', '
					<script type="text/javascript">
						' .$msoptionsprice. '
					</script>
			'), true);

			$this->modx->regClientScript(str_replace('[[+assetsUrl]]', $this->config['assetsUrl'], $this->modx->getOption('msoptionsprice_ms_op_front_js', $config, null)));

		}*/

	}


	function prepareArray(array $array) {
		$arr = array();
		foreach ($array as $k => &$v) {
			if (is_numeric($v)) $arr[$k] = $v;
		}
		return $arr;
	}

	/**
	 * Function for formatting price
	 *
	 * @param string $price
	 *
	 * @return string $price
	 *
	 * from https://github.com/bezumkin/miniShop2/blob/master/core/components/minishop2/model/minishop2/minishop2.class.php
	 */
	public function formatPrice($price = '0') {
		$pf = $this->modx->fromJSON($this->modx->getOption('ms2_price_format', null, '[2, ".", " "]'));
		if (is_array($pf)) {
			$price = number_format($price, $pf[0], $pf[1], $pf[2]);
		}

		if ($this->modx->getOption('ms2_price_format_no_zeros', null, true)) {
			if (preg_match('/\..*$/', $price, $matches)) {
				$tmp = rtrim($matches[0], '.0');
				$price = str_replace($matches[0], $tmp, $price);
			}
		}

		return $price;
	}


}