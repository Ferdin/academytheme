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
        wp_enqueue_style( 'norbert_academy_theme_editor_css', get_template_directory_uri() . '/editor-style.css', array(), '2.0' );
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
                'library' => 'bootstrap', // just for clarity
                'id' => ''
            ],
            $atts,
            'icon_heading'
        );

        $html = '<div class="icon-heading-block"';
        if( !(empty($atts['id']))){
            $html .= ' id="'. esc_attr($atts['id']).'"';
        }
        $html .= '>';
        $html .= '<i class="' . esc_attr($atts['icon_class']) . '" style="color:' . esc_attr($atts['icon_color']) . ';"></i>';
        $html .= '<h3 class="heading" style="color:' . esc_attr($atts['heading_color']) . ';">' . esc_html($atts['heading']) . '</h3>';
        $html .= '</div>';

        return $html;
    }

    add_shortcode('icon_heading', 'norbert_academy_icon_heading_block');

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
        wp_enqueue_script( 'gsap-js', 'https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js', [], false, true );
        // ScrollTrigger - with gsap.js passed as a dependency
        wp_enqueue_script( 'gsap-st', 'https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js', ['gsap-js'], false, true );
        // ScrollToPlugin - with gsap.js passed as a dependency
        wp_enqueue_script( 'gsap-sto', 'https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollToPlugin.min.js', ['gsap-js'], false, true );
        wp_enqueue_script( 'gsap-sms', 'https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollSmoother.min.js', ['gsap-js'], false, true );
        wp_enqueue_script( 'gsap-spt', 'https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/SplitText.min.js', ['gsap-js'], false, true );
        // Textplugin - with gsap.js passed as a dependency
        wp_enqueue_script( 'gsap-tp', 'https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/TextPlugin.min.js', ['gsap-js'], false, true );
        // Your animation code file - with gsap.js passed as a dependency for site wide usage
        wp_enqueue_script( 'gsap-js2', get_template_directory_uri() . '/js/app.js', ['gsap-js', 'gsap-sms', 'gsap-st', 'gsap-spt'], false, true );
        // Your animation code file - with gsap.js passed as a dependency for typewriting.
        wp_enqueue_script( 'gsap-js4', get_template_directory_uri() . '/js/typewriting.js', ['gsap-js', 'gsap-tp'], false, true );
        // Your animation code file - with gsap.js passed as a dependency for home page exclusive.
        wp_enqueue_script('gsap-js3', get_template_directory_uri()."/js/home.js",['gsap-js', 'gsap-st', 'gsap-sto'], false, true);
        // Animation code file - with gsap.js
        wp_enqueue_script('gsap-js5', get_template_directory_uri()."/js/course-list.js", ['gsap-js'], false, true);
        // Animation code file - with gsap.js
        wp_enqueue_script('gsap-js6', get_template_directory_uri()."/js/learning-path.js", ['gsap-js'], false, true);
        // Animation code file - with gsap.js
        wp_enqueue_script('gsap-js7', get_template_directory_uri()."/js/faq.js", ['gsap-js'], false, true);
    }

    add_action( 'wp_enqueue_scripts', 'theme_gsap_script' );

    // Site to refer: https://mygom.tech/
    function norbert_academy_post_grid_courses_shortcode($atts) {
        $atts = shortcode_atts(
            [
                'posts_per_page'    =>  6,
                'columns'           =>  2,
                'category'          =>  'Courses'
            ],
            $atts,
            'post_grid_courses'
            );
        
            //Query posts
            $args = [
                'post_type'         =>      'post',
                'posts_per_page'    =>      (int) $atts['posts_per_page'],
                'category_name'     =>      sanitize_text_field($atts['category']),
                'post_status'       =>      'publish'
            ];
            ob_start();
            ?>
                <div class="na-course-list-container">
            <?php
            $query = new WP_Query($args);
            if (!$query->have_posts()) {
                return '<p>No posts found.</p>';
            }
            while ($query->have_posts()) : 
                $query->the_post(); 
                ?>
                    <div class="na-home-course-item">
                        <a href="<?php the_permalink(); ?>">
                            <img src="<?php echo get_the_post_thumbnail_url(get_the_ID(), 'medium'); ?>" alt="<?php echo esc_attr(get_the_title()); ?>" class="na-home-course-item-image">
                            <p class="na-course-item-excerpt"><?php echo get_the_excerpt();?></p>
                            <h2><?php the_title();?></h2>
                        </a>
                    </div>
                <?php
            endwhile;
            wp_reset_postdata();
            ?>
                </div>
            <?php
            return ob_get_clean(); // Return captured output
    }

    add_shortcode('post_grid_courses', 'norbert_academy_post_grid_courses_shortcode');

    function norbert_academy_contact_form_shortcode($atts) {
        ob_start();
        ?>
        <form id="na-contact-form" class="na-contact-form">
            <?php wp_nonce_field('na_contact_form_action', 'na_contact_form_nonce');?>
            <p>
                <label for="na_name">Name:</label><br/>
                <input type="text" id="na_name" name="na_name" required>
            </p>
            <p>
                <label for="na_email">Email:</label><br/>
                <input type="email" id="na_email" name="na_email" required>
            </p>
            <p>
                <label for="na_message">Message:</label><br>
                <textarea id="na_message" name="na_message" rows="4" required></textarea>
            </p>
            <p>
                <label>
                    <input type="checkbox" name="na_newsletter" value="yes">
                    Sign up for our newsletter
                </label>
            </p>
            <p>
                <button type="submit">Send your message</button>
            </p>
            <div id="na-form-response" style="margin-top: 10px;"></div>
        </form>
        <?php
        return ob_get_clean(); 
    }

    add_shortcode('na_contact_form', 'norbert_academy_contact_form_shortcode');

    function na_add_custom_editor_gradients() {
        add_theme_support('editor-gradient-presets', [
            [
                'name'     => __('Norbert Academy Purple Blue Gradient', 'na-academy'),
                'slug'     => 'purple-blue',
                'gradient' => 'linear-gradient(106deg, rgba(121, 67, 232, 1) 0%, rgba(74, 75, 235, 1) 53%, rgba(65, 120, 240, 1) 100%)',
            ],
        ]);
    }
    add_action('after_setup_theme', 'na_add_custom_editor_gradients');

    function na_add_editor_styles() {
        add_theme_support('editor-styles');
        
        // Load your main styles in the editor so it matches the frontend
        add_editor_style([
            'fonts/fonts.css',
            'editor-style.css'     // Editor-specific tweaks (optional)
        ]);
    }
    add_action('after_setup_theme', 'na_add_editor_styles');

    function na_handle_ajax_contact_form() {
        // Check nonce
        if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['na_contact_form_nonce'], 'na_contact_form_action')) {
            wp_send_json_error(['message' => 'Security check failed.']);
        }

        // Sanitize inputs
        $name = sanitize_text_field($_POST['na_name']);
        $email = sanitize_email($_POST['na_email']);
        $message = sanitize_textarea_field($_POST['na_message']);
        $newsletter = isset($_POST['na_newsletter']) ? 'Yes' : 'No';

        // Example: Send email
        $to = get_option('admin_email');
        $subject = 'New AJAX Contact Form Submission';
        $body = "Name: $name\nEmail: $email\nMessage:\n$message\nNewsletter Signup: $newsletter";
        $headers = ['Content-Type: text/plain; charset=UTF-8'];

        $mail_sent = wp_mail($to, $subject, $body, $headers);

        if ($mail_sent) {
            wp_send_json_success(['message' => 'Thank you! Your message has been sent successfully.']);
        } else {
            wp_send_json_error(['message' => 'An error occurred while sending your message. Please try again.']);
        }
    }
    add_action('wp_ajax_na_contact_form', 'na_handle_ajax_contact_form');
    add_action('wp_ajax_nopriv_na_contact_form', 'na_handle_ajax_contact_form');

    function na_enqueue_contact_form_script() {
        wp_enqueue_script(
            'na-contact-form-js',
            get_template_directory_uri() . '/js/na-contact-form.js',
            [],
            null,
            true
        );

        wp_localize_script('na-contact-form-js', 'naForm', [
            'ajax_url' => admin_url('admin-ajax.php'),
            'nonce'    => wp_create_nonce('na_contact_form_action'),
        ]);
    }
    add_action('wp_enqueue_scripts', 'na_enqueue_contact_form_script');

    function norbert_academy_course_card_shortcode($atts) {
        $atts = shortcode_atts([
            'heading'      => '',
            'snippet'      => '',
            'link_address' => '',
        ], $atts, 'course_card');

        // Must have at least a heading
        if (empty($atts['heading'])) {
            return '';
        }

        // Escape values
        $heading = esc_html($atts['heading']);
        $snippet = !empty($atts['snippet']) ? '<p>' . esc_html($atts['snippet']) . '</p>' : '';
        $button  = '';

        // Optional link button
        if (!empty($atts['link_address'])) {
            $url = esc_url($atts['link_address']);
            $button = '<a href="' . $url . '" class="course-card-btn">Learn more</a>';
        }

        // Final card HTML
        return '
            <div class="course-card">
                <h3>' . $heading . '</h3>
                ' . $snippet . '
                ' . $button . '
            </div>
        ';
    }
    add_shortcode('course_card', 'norbert_academy_course_card_shortcode');

    function norbert_academy_learning_path($atts) {
        $atts = shortcode_atts([
            "title" => "",
            "list" => "",
            "percentage" => 100, // final progress value
            "radius" => 75,      // optional: make the circle bigger
            "stroke" => 10,      // stroke width
        ], $atts);

        // Parse list="key/value 1, key/value 2"
        $pairs = array_map('trim', explode(",", $atts['list']));
        $items = [];

        foreach ($pairs as $pair) {
            [$key, $val] = array_map('trim', explode("/", $pair));
            $items[] = ["key" => $key, "value" => $val];
        }

        $r = (int) $atts['radius'];
        $stroke = (int) $atts['stroke'];
        $svgSize = $r * 2 + $stroke; // width/height

        ob_start();
        ?>
        <div class="learning-path-wrapper" data-items='<?php echo json_encode($items); ?>'>
            <div class="progress-container" style="--circle-size: 180px; --circle-circumference: 408;">
                <svg class="progress-ring" width="<?php echo $svgSize; ?>" height="<?php echo $svgSize; ?>">
                    <circle class="progress-ring__background" cx="<?php echo $r + $stroke/2; ?>" cy="<?php echo $r + $stroke/2; ?>" r="<?php echo $r; ?>" stroke-width="<?php echo $stroke; ?>"/>
                    <circle class="progress-ring__circle" cx="<?php echo $r + $stroke/2; ?>" cy="<?php echo $r + $stroke/2; ?>" r="<?php echo $r; ?>" stroke-width="<?php echo $stroke; ?>"/>
                </svg>
                <div class="progress-text">0%</div>
            </div>
            <div class="learning-path-course-title">
                <h2><?php echo $atts['title'];?></h2>
            </div>
            <div class="lp-controls">
                <button class="lp-play"><i class="bi bi-play-circle"></i></button>
                <button class="lp-pause"><i class="bi bi-pause-circle"></i></button>
                <button class="lp-back"><i class="bi bi-skip-backward-circle"></i></button>
                <button class="lp-restart"><i class="bi bi-arrow-counterclockwise"></i></button>
            </div>
            <div class="content-container">
                <h2 class="lp-heading"></h2>
                <p class="lp-description"></p>
            </div>
        </div>
        <?php
        return ob_get_clean();
    }

    add_shortcode('learning_path_card', 'norbert_academy_learning_path');

    function norbert_academy_frequently_asked_questions($atts) {
        $atts = shortcode_atts([
            "question" => "",
            "answer" => ""
        ], $atts);
         ob_start();
        ?>
            <div class="faq-item">
                <div class="faq-question"><?php echo $atts['question'];?></div>
                <div class="faq-answer"><?php echo $atts['answer'];?></div>
            </div>
        <?php
        return ob_get_clean();
    }

    add_shortcode('norbert_academy_faq', 'norbert_academy_frequently_asked_questions');
    function norbert_academy_post_grid_shortcode($atts) {
        $atts = shortcode_atts(
            [
                'posts_per_page'    => 6,
                'columns'           => 2,
                'category'          => 'Main News',
                'heading_color'     => '#ffffff'
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
        
        $color = sanitize_text_field( $atts['heading_color'] );
    
        // Allow only valid 3- or 6-digit hex colors (with or without '#')
        if ( ! preg_match( '/^#?([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/', $color ) ) {
            $color = '#ffffff'; // fallback
        } else {
            // Ensure it starts with a '#'
            if ( strpos( $color, '#' ) !== 0 ) {
                $color = '#' . $color;
            }
        }
        $query = new WP_Query($args);
        $post_data = [];                    
        if (!$query->have_posts()) {
            return '<p>No posts found.</p>';
        }        
        while ($query->have_posts()) : 
            $query->the_post(); 
            $post_data[] = [
                'title'         => get_the_title(),
                'excerpt'       => get_the_excerpt(),
                'link'          => get_permalink(),
                'thumb'         => get_the_post_thumbnail_url(get_the_ID(), 'medium'),
                'heading_color' => esc_attr( $color )
            ];
        endwhile;
        wp_reset_postdata();

        // Pass post data to JS
        wp_localize_script('gsap-js3', 'NorbertAcademyHomeArticleData', [
            'posts' => $post_data,
        ]);

        ob_start();
        ?>
        <div class="na-article-container">
            <div class="na-article-container-child-1">
                <h2 class="has-large-font-size" style="color:<?php echo esc_attr( $color ); ?>!important;">Post Title</h2>
                <p>Exercpts</p>
                <a>Read More</a>
            </div>
            <div class="na-article-container-child-2">
                <div class="na-post-grid columns-<?php echo esc_attr($atts['columns']); ?>" id="na-post-grid-section">     
                    <!--JS Rendering Here-->
                </div>
            </div>
        </div>         
        <?php
        return ob_get_clean(); // Return captured output
    }
        
    add_theme_support('post-thumbnails');
    add_shortcode('post_grid', 'norbert_academy_post_grid_shortcode');

    function norbert_academy_typewriting_animation($atts, $content = null){
         static $typewriter_instances = [];
        if (empty($content)) {
            return '';
        }
        
        // Clean up the content
        $content = trim($content);
        
        // Generate unique ID for this instance
        $unique_id = 'typewriter-' . uniqid();
        
        $atts = shortcode_atts(array(
            'speed'     =>  '0.05',
            'delay'     =>  '0.5',
            'cursor'    =>  'true'
        ), $atts);
        
        $speed = floatval($atts['speed']);
        $delay = floatval($atts['delay']);
        $show_cursor = $atts['cursor'] === 'true';
        
        // Store this instance configuration
        $typewriter_instances[] = [
            'text'    => htmlspecialchars($content),
            'speed'   => $speed,
            'delay'   => $delay,
            'cursor'  => $show_cursor
        ];
        
        wp_localize_script('gsap-js4', 'NorbertAcademyTypeWriting', [
            'instances' => $typewriter_instances,
        ]);

        // Build the output HTML
        $output = '<div class="typewriter-container">';
        $output .= '<div class="typewriter-icon-container"><i class="bi bi-arrow-right-circle-fill btn-norbert-academy-right"></i></div>';
        $output .= '<code class="typewriter-raw" style="display:none;"></code>';
        $output .= '<code class="typewriter-display"></code>';
        $output .= '<div class="typewriter-bottom">We teach: <span class="na-cplus-plus">C++</span>, <span class="na-php">PHP</span>, <span class="na-javascript">Javascript</span>, and <span class="na-more">More</div>';
        $output .= '</div>';
        
        return $output;
    }
    add_shortcode('typewriting_animation', 'norbert_academy_typewriting_animation');

    // Prevent wpautop from running on this shortcode's content
    add_filter('the_content', function($content) {
        // Protect shortcode content from wpautop
        $pattern = '/\[typewriting_animation([^\]]*)\](.*?)\[\/typewriting_animation\]/s';
        $content = preg_replace_callback($pattern, function($matches) {
            // Remove any <br /> tags and preserve original formatting
            $inner = preg_replace('/<br\s*\/?>/', '', $matches[2]);
            $inner = preg_replace('/<p\s*\/?>/', '', $inner);
            $inner = preg_replace('/<\/p\s*\/?>/', '', $inner);
            return '[typewriting_animation' . $matches[1] . ']' . $inner . '[/typewriting_animation]';
        }, $content);
        return $content;
    }, 9); // Priority 9 runs before wpautop (priority 10)