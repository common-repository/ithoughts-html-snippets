<?php
/**
 * Backbone class file
 *
 * @copyright 2015-2016 iThoughts Informatique
 * @license https://www.gnu.org/licenses/gpl-3.0.html GPLv3
 * @package iThoughts\iThoughts WordPress Plugin Toolbox
 * @author Gerkin
 *
 * @version 4.0
 */

namespace ithoughts\v4_0;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

if(!class_exists(__NAMESPACE__."\\Backbone")){
	/**
	 * Backbone used in all plugins. Should be inherited by Backbone's plugin
	 */
	abstract class Backbone extends \ithoughts\v1_0\Singleton{
		/**
		 * @var	mixed	$options			Plugin options
		 */
		protected $options = NULL;
		/**
		 * @var	boolean	$js_aliases_include=TRUE	Include JS Aliases
		 */
		protected $js_aliases_include = TRUE;
		/**
		 * @var	mixed	$defaultOptions		Plugin default options
		 */
		protected $defaultOptions;
		/**
		 * @var	string	$optionsName		Identifier of the plugin options
		 */
		protected $optionsName;
		/**
		 * @var	string	$base_class_path_path	Path to the root directory of the plugin, eg the one containing readme.txt
		 */
		protected $base_path;
		/**
		 * @var	string	$base_lang_path		Path to the lang directory
		 */
		protected $base_lang_path;
		/**
		 * @var	string	$base_class_path	Path to the class directory
		 */
		protected $base_class_path;
		/**
		 * @var	string	$base_url			URL to the root directory
		 */
		protected $base_url;
		/**
		 * @var string	$minify				Minifying prefix
		 */
		protected $minify;
		/**
		 * @var string[]	$scripts		Scripts to enqueue
		 */
		protected $scripts = array();
		/**
		 * Construct the generic backbone. Registers global scripts It MUST be called by child backbones.
		 */
		protected function __construct(){
			if($this->base_path == NULL){
				throw new \Exception("Missing definition of Backbone::\$basepath");
			}
			$paths = $this::preparePaths($this->base_path);
			$this->base_path = $paths[0];
			//var_dump($paths);
			if($this->base_class_path == NULL)
				$this->base_class_path = $this->base_path."/class";
			if($this->base_lang_path == NULL)
				$this->base_lang_path = $this->base_path."/lang";
			if($this->base_url == NULL)
				$this->base_url = $paths[1];
			//var_dump($this->base_url);
			if((defined("WP_DEBUG") && WP_DEBUG) || (defined("SCRIPT_DEBUG") && SCRIPT_DEBUG))
				$this->minify = "";
			else
				$this->minify = ".min";



			if($this->js_aliases_include)
				add_action( 'init',			array(&$this,	'backbone_enqueue_scripts_hight_priority'),	0 );
		}

		public function backbone_enqueue_scripts_hight_priority(){
			wp_register_script('ithoughts-core-v4', $this->get_base_url() . '/submodules/iThoughts-WordPress-Plugin-Toolbox/js/ithoughts-core-v4'.$this->get_minify().'.js', array('jquery'), "4.0.0", false);

			wp_register_script(
				'ithoughts-simple-ajax-v3',
				$this->get_base_url() . '/submodules/iThoughts-WordPress-Plugin-Toolbox/js/simple-ajax-form-v3'.$this->get_minify().'.js', array('jquery-form',"ithoughts-core-v4"),
				"3.0.0"
			);
			wp_register_script(
				'ithoughts-serialize-object-v3',
				$this->get_base_url() . '/submodules/iThoughts-WordPress-Plugin-Toolbox/js/jquery-serialize-object-v3'.$this->get_minify().'.js', array("ithoughts-core-v4"),
				"3.0.0"
			);
		}




		/**
		 * Returns the plugin options. If it's the first time that this function is called, it also auto-init the options, retrieving them from the DB
		 * @param boolean $defaults = false Return only default options of the plugin
		 *
		 * @return array Options
		 */
		public function get_options($onlyDefaults = false){
			if($onlyDefaults)
				return $this->defaultOptions;

			// If options are not set, retrieve from DB
			$this->define_options();
			return $this->options;
		}

		/**
		 * Returns the desired plugin option. If it's the first time that this function is called, it also auto-init the options, retrieving them from the DB
		 * @param boolean $name				Name of the option
		 * @param boolean $defaults = false Return only default value of this option in the plugin
		 *
		 * @return mixed   Option
		 */
		public function get_option($name, $onlyDefaults = false){
			if($onlyDefaults)
				return (isset($this->defaultOptions[$name]) ? $this->defaultOptions[$name] : NULL);

			$this->define_options();
			if(isset($this->options[$name]))
				return $this->options[$name];
			else
				return (isset($this->defaultOptions[$name]) ? $this->defaultOptions[$name] : NULL);
		}

		/**
         * Try to define options by merging with default if not set
         */
		private function define_options(){
			if($this->options == NULL)
				$this->options = array_merge($this->defaultOptions, get_option( $this->optionsName, $this->get_options(true) ) );
		}

		/**
		 * Set plugin options
		 * @param array options		Set options of the plugin
		 * @param boolean $update = true Update options stored in base
		 *
		 * @return array Options
		 */
		public function set_options($options, $update = true){
			$this->options = array_merge($this->options, $options);
			if($update){
				wp_cache_delete ( 'alloptions', 'options' );
				update_option( $this->optionsName, $this->options );
				wp_cache_delete ( 'alloptions', 'options' );
			}
			return $this->options;
		}

		/**
		 * Set plugin options
		 * @param array options		Set options of the plugin
		 * @param boolean $update = true Update options stored in base
		 *
		 * @return array Options
		 */
		public function set_option($name, $value, $update = true){
			$this->options[$name] = $value;
			if($update){
				update_option( $this->optionsName, $this->options );
			}
			return $this->options;
		}

		/**
		 * Get plugin base path
		 *
		 * @return string Path to the root directory
		 */
		public function get_base_path(){
			return $this->base_path;
		}

		/**
		 * Get plugin base path to langs
		 *
		 * @return string Path to the root directory
		 */
		public function get_base_lang_path(){
			return $this->base_lang_path;
		}

		/**
		 * Get plugin base path to classes
		 *
		 * @return string Path to the root directory
		 */
		public function get_base_class_path(){
			return $this->base_class_path;
		}

		/**
		 * Get plugin base url to access resources
		 *
		 * @return string Path to the root directory
		 */
		public function get_base_url(){
			return $this->base_url;
		}

		/**
		 * Prepare enqueue of plugin script
		 * @param string $scriptName Name of the script
		 *
		 * @return NULL
		 */
		public function add_script($scriptName){
			$this->scripts[$scriptName] = true;
		}

		/**
		 * Prepare enqueue of several plugin scripts
		 * @param string[] $scriptName Name of the script
		 *
		 * @return NULL
		 */
		public function add_scripts($scriptNames){
			foreach($scriptNames as $scriptName){
				$this->scripts[$scriptName] = true;
			}
		}

		/**
		 * Return true if script was enqueued with {@link add_script} or {@link add_scripts}
		 * @param string $scriptName Name of the script
		 *
		 * @return boolean
		 */
		public function get_script($scriptName){
			return (isset($this->scripts[$scriptName]) && $this->scripts[$scriptName] === true);
		}

		/**
		 * Return an associative array with values set to true if script was enqueued with {@link add_script} or {@link add_scripts}
		 * @param string[] $scriptNames Name of scripts
		 *
		 * @return boolean[]
		 */
		public function get_scripts($scriptNames = null){
			if($scriptName == null)
				return $this->scripts;
			$ret = array();
			foreach($scriptNames as $scriptName){
				$ret[$scriptName] = (isset($this->scripts[$scriptName]) && $this->scripts[$scriptName] === true);
			}
			return $ret;
		}

		/**
		 * Get the minifying prefix
		 *
		 * @return string The minifying suffix
		 */
		public function get_minify(){
			return $this->minify;
		}

		private static function preparePaths($file){
			$dirname = dirname($file);
			return array($dirname, plugins_url()."/".dirname(plugin_basename($file)));
		}
	}
}