<?php
    function norbert_academy_theme_setup() {
        add_theme_support( 'custom-logo', [
            'height'      => 60,    // default logo height
            'width'       => 200,   // default logo width
            'flex-height' => true,  // allow flexible height
            'flex-width'  => true,  // allow flexible width
        ]);
        register_nav_menus(
            [
                'primary' => __( 'Primary Menu', 'norbert-academy'),
                'footer' => __('Footer Menu', 'norbert-academy')
            ]
        );
    }
    
    add_action( 'after_setup_theme', 'norbert_academy_theme_setup');
    function norbert_academy_theme_enqueue_styles() {        
        // Custom fonts
        wp_enqueue_style( 'norbert_academy_theme_home_css', get_template_directory_uri() . '/css/home.css', array(), '2.0' );
        wp_enqueue_style( 'norbert_academy_theme_font_css', get_template_directory_uri() . '/fonts/fonts.css', array(), '2.0' );
    }
    
    add_action( 'wp_enqueue_scripts', 'norbert_academy_theme_enqueue_styles' );

    function norbert_academy_icon_heading_block($atts) {
        $atts = shortcode_atts(
            [
                'icon' => '⭐',
                'heading' => 'Your Heading Here',
                'icon_color' => '#ffcc00',
                'heading_color' => '#000000'
            ],
            $atts,
            'icon_heading'
        );

        $html = '<div class="icon-heading-block">';
        $html .= '<span class="icon" style="color:' . esc_attr($atts['icon_color']) . ';">' . esc_html($atts['icon']) . '</span>';
        $html .= '<h3 class="heading" style="color:' . esc_attr($atts['heading_color']) . ';">' . esc_html($atts['heading']) . '</h3>';
        $html .= '</div>';

        return $html;
    }

    add_shortcode('icon_heading', 'norbert_academy_icon_heading_block');


