<?php
/**
 * Plugin Name: Text to Speech Reader
 * Description: Reads selected text with play, pause, stop, voice selection, speed control, and auto-read.
 * Version: 1.1
 * Author: Shubham Dixit
 */

if (!defined('ABSPATH')) exit;

function ttsr_enqueue_scripts() {
    wp_enqueue_script('tts-reader', plugin_dir_url(__FILE__) . 'tts-reader.js', [], '1.1', true);
    wp_enqueue_style('tts-reader-style', plugin_dir_url(__FILE__) . 'tts-reader.css');
}
add_action('wp_enqueue_scripts', 'ttsr_enqueue_scripts');

function ttsr_add_controls() {
    echo '
    <div id="tts-controls" style="display: block;">
        <label>Speed: <input type="range" id="tts-rate" min="0.5" max="2" value="1" step="0.1"></label>
        <label><input type="checkbox" id="tts-auto-read"> Auto-read</label>
        <div class="tts-controls-wrap">
        <button id="tts-play">►</button>
        <button id="tts-pause">⏸</button>
        <button id="tts-stop">⏹</button>
        </div>
    </div>';
}
add_action('wp_footer', 'ttsr_add_controls');
