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
    function norbert_academy_enqueue_icons() {
        // Bootstrap Icons CDN
        wp_enqueue_style(
            'bootstrap-icons',
            'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css',
            array(),
            '1.11.3'
        );
    }
    add_action('wp_enqueue_scripts', 'norbert_academy_enqueue_icons');

    function norbert_academy_icon_heading_block($atts) {
        $atts = shortcode_atts(
            [
                'icon_class' => 'bi bi-star', // default Bootstrap icon class
                'heading' => 'Your Heading Here',
                'icon_color' => '#ffcc00',
                'heading_color' => '#000000',
                'library' => 'bootstrap' // just for clarity
            ],
            $atts,
            'icon_heading'
        );

        $html = '<div class="icon-heading-block">';
        $html .= '<i class="' . esc_attr($atts['icon_class']) . '" style="color:' . esc_attr($atts['icon_color']) . ';"></i>';
        $html .= '<h3 class="heading" style="color:' . esc_attr($atts['heading_color']) . ';">' . esc_html($atts['heading']) . '</h3>';
        $html .= '</div>';

        return $html;
    }

    add_shortcode('icon_heading', 'norbert_academy_icon_heading_block');

    /*
    function norbert_academy_post_grid_shortcode($atts) {
        $atts = shortcode_atts(
            [
                'posts_per_page' => 6,
                'columns'        => 3,
                'category'       => '',
            ],
            $atts,
            'post_grid'
        );

        // Query posts
        $args = [
                'post_type'      => 'post',
                'posts_per_page' => (int) $atts['posts_per_page'],
                'category_name'  => sanitize_text_field($atts['category']),
                'post_status'    => 'publish',
                ];

        $query = new WP_Query($args);

        if (!$query->have_posts()) {
            return '<p>No posts found.</p>';
        }        

        ob_start();
        ?>
         <div class="na-post-grid columns-<?php echo esc_attr($atts['columns']); ?>">
        <?php while ($query->have_posts()) : $query->the_post(); ?>
            <div class="na-post-card">
                <?php if (has_post_thumbnail()) : ?>
                    <div class="na-post-thumb">
                        <a href="<?php the_permalink(); ?>">
                            <?php the_post_thumbnail('medium'); ?>
                        </a>
                    </div>
                <?php endif; ?>
                <div class="na-post-content">
                    <h3 class="na-post-title">
                        <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                    </h3>
                    <p class="na-post-excerpt"><?php echo wp_trim_words(get_the_excerpt(), 20, '...'); ?></p>
                </div>
            </div>
        <?php endwhile; ?>
    </div>
    <?php
        wp_reset_postdata();
        return ob_get_clean(); // Return captured output
    }
    */
    function norbert_academy_post_grid_shortcode($atts) {
        $atts = shortcode_atts(
            [
                'posts_per_page' => 6,
                'columns'        => 2,
                'category'       => '',
            ],
            $atts,
            'post_grid'
        );

        // Query posts
        $args = [
                'post_type'      => 'post',
                'posts_per_page' => (int) $atts['posts_per_page'],
                'category_name'  => sanitize_text_field($atts['category']),
                'post_status'    => 'publish',
                ];

        $query = new WP_Query($args);

        if (!$query->have_posts()) {
            return '<p>No posts found.</p>';
        }        

        ob_start();
        ?>
        <div class="na-article-container">
            <div class="na-article-container-child-1">
                <h2>Post Title</h2>
                <p>Exercpts</p>
                <button>Read More</button>
            </div>
            <div class="na-article-container-child-2">
                <div class="na-post-grid columns-<?php echo esc_attr($atts['columns']); ?>">
                    <?php while ($query->have_posts()) : $query->the_post(); ?>
                    <div class="na-post-card">
                        <?php if (has_post_thumbnail()) : ?>
                            <div class="na-post-thumb">
                                <a href="<?php the_permalink(); ?>">
                                    <?php the_post_thumbnail('medium'); ?>
                                </a>
                            </div>
                        <?php endif; ?>
                    </div>
                    <?php endwhile; ?>
                </div>
            </div>
        </div>
         
    <?php
        wp_reset_postdata();
        return ob_get_clean(); // Return captured output
    }
    
add_theme_support('post-thumbnails');
add_shortcode('post_grid', 'norbert_academy_post_grid_shortcode');

function norbert_academy_customize_register( $wp_customize ) {
    // === Header Colors Section ===
    $wp_customize->add_section( 'header_colors_section', [
        'title'       => __( 'Header Colors', 'norbert-academy' ),
        'priority'    => 30,
        'description' => 'Customize the header colors',
    ] );

    // === Background Color ===
    $wp_customize->add_setting( 'header_background_color', [
        'default'           => '#ffffff',
        'transport'         => 'refresh',
        'sanitize_callback' => 'sanitize_hex_color',
    ] );

    $wp_customize->add_control(
        new WP_Customize_Color_Control(
            $wp_customize,
            'header_background_color_control',
            [
                'label'    => __( 'Header Background Color', 'norbert-academy' ),
                'section'  => 'header_colors_section',
                'settings' => 'header_background_color',
            ]
        )
    );

    // === Navigation Font Color ===
    $wp_customize->add_setting( 'header_nav_font_color', [
        'default'           => '#000000',
        'transport'         => 'refresh',
        'sanitize_callback' => 'sanitize_hex_color',
    ] );

    $wp_customize->add_control(
        new WP_Customize_Color_Control(
            $wp_customize,
            'header_nav_font_color_control',
            [
                'label'    => __( 'Navigation Font Color', 'norbert-academy' ),
                'section'  => 'header_colors_section',
                'settings' => 'header_nav_font_color',
            ]
        )
    );
}
add_action( 'customize_register', 'norbert_academy_customize_register' );


function norbert_academy_customize_css() {
    $header_bg = get_theme_mod('header_background_color', '#fffffff');
    $nav_color = get_theme_mod('header_nav_font_color', '#000000')
    ?>
        <style type="text/css">
            .site-header {
                background-color: <?php echo esc_html( $header_bg);?>;
            }
            .site-header .main-nav .nav-menu a {
                color: <?php echo esc_html($nav_color);?>
            }
            .site-header .main-nav .nav-menu a:hover {
                opacity: 0.8;
            }
        </style>
    <?php
}

add_action('wp_head', 'norbert_academy_customize_css');

function theme_gsap_script(){
    // The core GSAP library
    wp_enqueue_script( 'gsap-js', 'https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js', array(), false, true );
    // ScrollTrigger - with gsap.js passed as a dependency
    wp_enqueue_script( 'gsap-st', 'https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js', array('gsap-js'), false, true );
    // Your animation code file - with gsap.js passed as a dependency
    wp_enqueue_script( 'gsap-js2', get_template_directory_uri() . '/js/app.js', array('gsap-js'), false, true );
}

add_action( 'wp_enqueue_scripts', 'theme_gsap_script' );