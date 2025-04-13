<?php
/**
 * Template Name: Page Post 
 */

get_header();
?>

<div class="container">
    <?php
    $order_option = get_field('orderby'); // ACF field: 'rand', 'views', or default
    $paged = get_query_var('paged') ? get_query_var('paged') : 1;
    $per_page = get_option('posts_per_page');

    $args = [
        'post_type'      => 'post',
        'posts_per_page' => $per_page,
        'paged'          => $paged,
    ];

    if ($order_option === 'rand') {
        $args['orderby'] = 'rand';
    } elseif ($order_option === 'views') {
        $args['meta_key'] = 'post_views_count';
        $args['orderby'] = 'meta_value_num';
        $args['order'] = 'DESC';
    } else {
        $args['orderby'] = 'date';
        $args['order'] = 'DESC';
    }

    $query = new WP_Query($args);
    $total_pages = $query->max_num_pages;

    if ($query->have_posts()) : ?>
        <div id="post-list">

            <?php if ($total_pages > 1): ?>
                <div class="pagination">
                    <?php for ($i = 1; $i <= $total_pages; $i++): ?>
                        <a href="<?php echo get_pagenum_link($i); ?>" class="<?php echo ($i == $paged ? 'active' : ''); ?>">
                            <?php echo $i; ?>
                        </a>
                    <?php endfor; ?>
                </div>
            <?php endif; ?>

            <div class="items-center search-block"><?php echo do_shortcode('[search style="flat"]'); ?></div>

            <div class="row large-columns-5 medium-columns- small-columns-2 row-small">
                <?php while ($query->have_posts()) : $query->the_post(); ?>
                    <?php
                    $post_id = get_the_ID();
                    $post_title = get_the_title();
                    $post_link = get_permalink();
                    $post_image = get_field('feature_img', $post_id);
                    $services = get_the_terms($post_id, 'service');
                    $service_name = (!empty($services) && !is_wp_error($services)) ? esc_html($services[0]->name) : 'No Service';
                    $is_valid_image = (!empty($post_image) && preg_match('/\.(jpg|jpeg)$/i', $post_image));
                    ?>
                    <div class="col col-item post-card">
                        <a href="<?php echo esc_url($post_link); ?>" class="post-item block relative">
                            <div class="post-card__header"><?php echo wp_trim_words(get_the_excerpt(), 10, '...'); ?></div>
                            <?php if ($is_valid_image): ?>
                                <div class="post-card__image-container">
                                    <img class="post-card__image" src="<?php echo esc_url($post_image); ?>" alt="<?php echo esc_attr($post_title); ?>">
                                </div>
                            <?php else: ?>
                                <div class="post-card__image-container bg-black"></div>
                            <?php endif; ?>
                            <div class="post-content relative z-10 p-4 bg-white">
                                <p class="post-service text-sm text-gray-600"><?php echo esc_html($service_name); ?></p>
                            </div>
                        </a>
                    </div>
                <?php endwhile; ?>
            </div>

            <?php if ($total_pages > 1): ?>
                <div class="pagination">
                    <?php for ($i = 1; $i <= $total_pages; $i++): ?>
                        <a href="<?php echo get_pagenum_link($i); ?>" class="<?php echo ($i == $paged ? 'active' : ''); ?>">
                            <?php echo $i; ?>
                        </a>
                    <?php endfor; ?>
                </div>
            <?php endif; ?>

        </div>
    <?php endif; wp_reset_postdata(); ?>
</div>

<?php get_footer(); ?>
