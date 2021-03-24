<?php

if (!function_exists('_bs5_link')) {
  function _bs5_link($suffix = '') {
    global $conf;

    return '
    <link rel="stylesheet" href="'. $conf->incurl .'public/css/bs5.css?v=1.0.'. date('dmyHis', time()) .'" type="text/css" media="screen" charset="utf-8" />
    ' . $suffix;
  }
}


if (!function_exists('_always_blocked_artists')) {
  function _always_blocked_artists() {
    return [
      'private',
      'specials',
      'commissions-gallery',
    ];
  }

  function _is_always_blocked_artist($artist, $blocked_artists = []) {
    $artist = _mod($artist);
  }
}


if (!function_exists('linkedin_share_button')) {
  function linkedin_share_button($url = '') {
    global $conf;

    if (!$url) {
      $url = $conf->url;
    }

    $html = '';

    // Share
    $html .= '<script src="https://platform.linkedin.com/in.js" type="text/javascript">lang: en_US</script>';
    $html .= '<script type="IN/Share" data-url="" data-title="Title of the document" data-description="sss"></script>';

    // Follow
    // $html .= '<script src="https://platform.linkedin.com/in.js" type="text/javascript"> lang: en_US</script>';
    // $html .= '<script type="IN/FollowCompany" data-id="26668249" data-counter="bottom"></script>';

    return $html;
  }
}

if (!function_exists('filter_result')) {
  function filter_result($needles = [], $haystack = [], $options = []) {
    global $conf;

    if (!$haystack || count($haystack) < 1) {
      return;
    }

    if (!$needles || count($needles) < 1) {
      return $haystack;
    }

    $options = array_merge([
      'columns' => [],
      'condition' => 'or', // and
    ], $options);
    extract($options);
    echo '<pre>'; print_r($options); echo '</pre>';
    $condition = strtolower($condition);

    $filtered = array_filter($haystack, function ($var) use($needles, $columns, $condition, $search_all) {
      $exists = false;
      if ($condition == 'and') {
        $exists = true;
      }

      $search_in = $columns;
      if (count($columns) < 1) {
        $search_in = array_keys($var);
      }

      foreach ($search_in as $column) {
        $is_break = false;
        // echo '<pre>'; print_r($column); echo '</pre>';
        $value = $var[$column];
        foreach ($needles as $needle) {
          // echo '<pre>'; print_r($needle); echo '</pre>';
          $founded = stripos($value, $needle);
          // echo '<pre>'; print_r($founded); echo '</pre>';

          if ($condition == 'or') {
            if ($founded == false) {
              //
            } else {
              $exists = true;
              $is_break = true;
              break;
            }
          } elseif ($condition == 'and') {
            if ($founded == false) {
              $exists = false;
              $is_break = true;
              break;
            } else {
              //
            }
          }
        }

        if ($is_break) {
          break;
        }
      }

      return $exists;
    });

    if ($filtered && count($filtered) > 0) {
      return $filtered;
    }

    return;
  }
}

if (!function_exists('fix_keyword_cannibalization')) {
  function fix_keyword_cannibalization($slug = '', $implode = false, $custom_keywords = []) {
    global $conf;

    if (!$slug) {
      $slug = 'index';
    }

    $custom_keywords = (array) $custom_keywords;
    if (count($custom_keywords) > 0) {
      $keywords = $custom_keywords;
    } else {
      $keywords = (array) $conf->raw_keywords;
    }

    if (count($keywords) > 0) {
      switch (strtolower($slug)) {
        case 'popular-oil-paintings':
          $keywords[] = 'famous oil paintings';
          $keywords[] = 'famous oil paintings on canvas';
          break;
        case 'request-a-painting':
          $keywords[] = 'canvas paintings for sale';
          break;

        default:
          break;
      }
    }

    if ($implode === true) {
      return implode(', ', $keywords);
    }
    return $keywords;
  }
}

if (!function_exists('get_page_h2')) {
  function get_page_h2($slug = '', $class = []) {
    global $conf;
    global $db;

    if (!$slug) {
      return '';
    }

    $data = $db->select($conf->prefix.'pages_text', " subtitle from {table} where slug = '". $slug ."' ");
    if (empty($data)) {
      return '';
    } else {
      if (isset($data[0]['subtitle']) && $data[0]['subtitle']) {
        $class = (array) $class;
        if (count($class) > 0) {
          $class = implode(' ', $class);
        }
        return '<h2 class="sub_title top8 bottom24 '. $class .'">'. $data[0]['subtitle'] .'</h2>';
      }
      return '';
    }
  }
}

if (!function_exists('get_expand_button')) {
  function get_expand_button($expand_button = false) {
    if ($expand_button !== true) {
      return '';
    }

    return '<div class="gradient"><a class="toggle" href="#"><span class="down open">ˇ</span><span class="up">ˆ</span></a></div>';
  }
}

if (!function_exists('get_page_description')) {
  function get_page_description($slug = '', $class = [], $demo = false) {
    global $conf;
    global $db;

    $conf->expand_button = false;

    if (!$slug) {
      return '';
    }

    $demo = (bool) $demo;
    if ($demo === true) {
      $field = 'description_demo';
    } else {
      $field = 'description';
    }

    $data = $db->select($conf->prefix.'pages_text', " ". $field ." from {table} where slug = '". $slug ."' ");
    if (empty($data)) {
      return '';
    } else {
      if (isset($data[0][$field]) && $data[0][$field]) {
        $conf->expand_button = true;

        $class = (array) $class;
        if (count($class) > 0) {
          $class = implode(' ', $class);
        }
        return '<div class="box-description '. $class .'">'. $data[0][$field] .'</div><br><br>';
      }
      return '';
    }
  }
}

if (!function_exists('get_page_h1')) {
  function get_page_h1($slug = '', $class = []) {
    global $conf;
    global $db;

    if (!$slug) {
      return '';
    }

    $data = $db->select($conf->prefix.'pages_text', " name, title from {table} where slug = '". $slug ."' ");
    if (empty($data)) {
      return '';
    } else {
      if (isset($data[0]['title']) && $data[0]['title']) {
        $field = 'title';
      } else {
        $field = 'name';
      }

      if (isset($data[0][$field]) && $data[0][$field]) {
        $class = (array) $class;
        if (count($class) > 0) {
          $class = implode(' ', $class);
        }
        return '<h1 class="title _title '. $class .'"><span class="painting_name"><strong>'. $data[0][$field] .'</strong></span></h1>';
      }
      return '';
    }
  }
}

if (!function_exists('get_page_text')) {
  function get_page_text($slug = '') {
    global $conf;
    global $db;

    if (!$slug) {
      return '';
    }

    $data = $db->select($conf->prefix.'pages_text', " * from {table} where slug = '". $slug ."' ");
    if (empty($data)) {
      return '';
    } else {
      if (!isset($data[0]['title']) || !$data[0]['title']) {
        $data[0]['title'] = $data[0]['name'];
      }
      return $data[0];
    }
  }
}

function _get_art_movement_key($type, $slug) {
  $art_movements = $GLOBALS['conf']->art_movements['key_replacements'];
  return array_search($slug, $art_movements[$type]);
}


function _get_art_movement_value($type, $key) {
  $art_movements = $GLOBALS['conf']->art_movements['key_replacements'];
  return $art_movements[$type][$key];
}


function _get_track_by_order($order_number = '') {
  if(empty($order_number) || $order_number == ''):
    return;
  else:
    $url = 'https://www.reproduction-galleries.com/track/track-gallery-by-order.php?order_number=' . $order_number . '&action=sandbox';
    $datas = array();
    $i = 0;
    $fp = @fopen($url, 'rb');
    while($line = @fgets($fp)):
      $line = trim($line);
      if(empty($line)):
        // Skip
      else:
        list($data['id'], $data['name'], $data['email'], $data['order_number'], $data['painting'], $data['ordered_date'], $data['status'], $data['tracking_number'], $data['airbourne_express'], $data['commissioned_date'], $data['artist'], $data['size'], $data['cost'], $data['deposit'], $data['shipping_cost'], $data['finished_date'], $data['special_comment'], $data['admin_status'], $data['price_paid'], $data['shipping_name'], $data['shipping_street'], $data['shipping_city'], $data['shipping_state'], $data['shipping_zip'], $data['country'], $data['phone_number'], $data['painting_image'], $data['tracking_url'], $data['description'], $data['border'], $data['owner']) = explode('::', $line);
        unset($line);

        $data['id'] = trim($data['id']);
        $data['name'] = trim($data['name']);
        $data['email'] = trim($data['email']);
        $data['order_number'] = trim($data['order_number']);
        $data['painting'] = trim($data['painting']);
        $data['ordered_date'] = trim($data['ordered_date']);
        $data['status'] = trim($data['status']);
        $data['tracking_number'] = trim($data['tracking_number']);
        $data['airbourne_express'] = trim($data['airbourne_express']);
        $data['commissioned_date'] = trim($data['commissioned_date']);
        $data['artist'] = trim($data['artist']);
        $data['size'] = trim($data['size']);
        $data['cost'] = trim($data['cost']);
        $data['deposit'] = trim($data['deposit']);
        $data['shipping_cost'] = trim($data['shipping_cost']);
        $data['finished_date'] = trim($data['finished_date']);
        $data['special_comment'] = trim($data['special_comment']);
        $data['admin_status'] = trim($data['admin_status']);
        $data['price_paid'] = trim($data['price_paid']);
        $data['shipping_name'] = trim($data['shipping_name']);
        $data['shipping_street'] = trim($data['shipping_street']);
        $data['shipping_city'] = trim($data['shipping_city']);
        $data['shipping_state'] = trim($data['shipping_state']);
        $data['shipping_zip'] = strtoupper(trim($data['shipping_zip']));
        $data['country'] = strtoupper(trim($data['country']));
        $data['phone_number'] = trim($data['phone_number']);
        $data['painting_image'] = trim($data['painting_image']);
        $data['tracking_url'] = trim($data['tracking_url']);
        $data['description'] = trim($data['description']);
        $data['border'] = trim($data['border']);
        $data['owner'] = strtolower(trim($data['owner']));

        if(!empty($data['ordered_date'])):
          $data['ordered_date'] = str_replace(' ', '-', $data['ordered_date']);
          list($day, $month, $year) = explode('-', $data['ordered_date']);
          $data['ordered_date'] = $year . '-' . $month . '-' . $day;
          $data['ordered_date'] = strtotime($data['ordered_date']);
          $data['ordered_date'] = date('Y-m-d', $data['ordered_date']);
        endif;

        if(!empty($data['finished_date'])):
          $data['finished_date'] = str_replace(' ', '-', $data['finished_date']);
          list($day, $month, $year) = explode('-', $data['finished_date']);
          $data['finished_date'] = $year . '-' . $month . '-' . $day;
          $data['finished_date'] = strtotime($data['finished_date']);
          $data['finished_date'] = date('Y-m-d', $data['finished_date']);
        endif;

        if(empty($data['owner'])):
          $data['owner'] = 'admin';
        endif;

        $datas[$i] = $data;

        $i++;
      endif;
    endwhile;
    @fclose($fp);

    return $datas;
  endif;
}


function _get_artists3() {
  $key = array();
  $result = array();
  $data = getPaintings('', '', 0, false);
  $count = count($data);
  for($i = 0; $i < $count; $i++) {
    $data[$i]['artist'] = str_replace(array(
      '(',
      ')',
    ), '', $data[$i]['artist']);
    $data[$i]['inspired_by'] = false;
    if (stripos($data[$i]['artist'], 'inspired by') !== false) {
      $data[$i]['inspired_by'] = true;
    }
    $mod = _mod($data[$i]['artist']);
    if(!in_array($mod, $key)) {
      $key[] = $mod;
      $result[] = array(
        'name' => $data[$i]['artist'],
        'mod_name' => $mod,
        'reverse_name' => $data[$i]['reverse'],
        'letter' => $data[$i]['az'],
                'inspired_by' => $data[$i]['inspired_by'],
      );

      echo $data[$i]['artist'].': '.$data[$i]['reverse'].', '.$data[$i]['az'].'<br />';
    }
  }
  return $result;
}


function _get_check() {
  $log = $GLOBALS['conf']->check_log;
  if(!file_exists($log)):
    echo 'Unknown check log';
  else:
    $fp = @fopen($log, 'rb');
    if(!$fp):
      echo 'Cannot open check log';
    else:
      $artists = array();
      while(!feof($fp)):
        $line = @fgets($fp);
        $line = trim($line);
        if($line != ''):
          if(!in_array($line, $artists)):
            $artists[] = $line;
          endif;
        endif;
        $line = '';
      endwhile;
      @fclose($fp);
      $fp = '';

      $artists = array_merge($artists, $GLOBALS['conf']->block_artists);

      return $artists;
    endif;
  endif;
}


function _get_file_info($file = '') {
  if(empty($file) || $file == '') {
    return false;
  } else {
    $file_info = @getimagesize($file['tmp_name']);

    $file['mime'] = strtolower($file['type']);
    $exp = explode('/', $file['mime']);
    $file['type'] = strtolower($exp[0]);
    unset($exp);

    $pathinfo = pathinfo($file['name']);
    $new_tmp = _random_filename();
    $new_name = _random_filename($pathinfo['filename']);
    $ext = strtolower($pathinfo['extension']);

    $return = [
      'tmp' => $file['tmp_name'],
      'name' => $file['name'],
      'mime' => $file['mime'],
      'type' => $file['type'],
      'size' => $file['size'],
      'width' => $file_info[0],
      'height' => $file_info[1],
      'code' => $file_info[2],
      'new_tmp' => $new_tmp,
      'new_name' => $new_name,
      'ext' => $ext,
    ];

    return $return;
  }
}


function _get_finished2($column = '', $find = '', $loop = true) {
  $log = $GLOBALS['conf']->finished_log;

  if(empty($column)):
    $column_exp = array();
    $column_exp_count = 0;
  else:
    $column_exp = explode('|', $column);
    $column_exp_count = count($column_exp);
  endif;

  if(!file_exists($log)):
    _error('Load finished failed', __LINE__, __FILE__);
  else:
    $fp = fopen($log, 'r');
    if(!$fp):
      _error('Load finished failed', __LINE__, __FILE__);
    else:
      // $a, $b
      $datas = array();
      $add = false;
      $break = false;
      $i = 0;
      while(($line = fgets($fp)) !== false):
        $append = true;

        list($data['id'], $data['title'], $data['artist'], $data['url'], $data['date'], $data['image'], $data['show'], $data['owner']) = explode('::', $line);
        unset($line);

        $data['id'] = trim($data['id']);
        $data['title'] = trim($data['title']);
        $data['artist'] = trim($data['artist']);
        $data['url'] = trim($data['url']);
        $data['date'] = trim($data['date']);
        $data['painting'] = trim($data['painting']);
        $data['show'] = strtolower(trim($data['show']));
        $data['owner'] = strtolower(trim($data['owner']));

        if(empty($data['show']) || $data['show'] != 'yes'):
          $data['show'] = 'no';
        endif;

        if(empty($data['owner'])):
          $data['owner'] = 'admin';
        endif;

        if(empty($column_exp_count)):
          $datas[] = $data;
          $i++;
        else:
          if(empty($find)):
            $found = false;
            for($b = 0; $b < $column_exp_count; $b++):
              if(empty($data[$column_exp[$b]])):
                $found = true;
              endif;
            endfor;

            if($found === true):
              $datas[] = $data;
              $i++;
            endif;
          else:
            if($find == '!'):
              $found = false;
              for($b = 0; $b < $column_exp_count; $b++):
                if(!empty($data[$column_exp[$b]])):
                  $found = true;
                endif;
              endfor;

              if($found === true):
                $datas[] = $data;
                $i++;
              endif;
            else:
              $found = false;
              for($b = 0; $b < $column_exp_count; $b++):
                preg_match($find, str_replace("  ", " ", $data[$column_exp[$b]]), $matches);
                if(!$matches):
                  // Skip
                else:
                  if(!empty($matches[1])):
                    $found = true;
                  endif;
                endif;
              endfor;

              if($found === true):
                $datas[] = $data;
                $i++;
              endif;
            endif;
          endif;
        endif;

        if($loop === true):
          // Continue next line
        else:
          if($loop === false):
            break;
          else:
            if($i == $loop):
              break;
            endif;
          endif;
        endif;
      endwhile;

      fclose($fp);

      if(!empty($datas)):
        return $datas;
      else:
        return;
      endif;
    endif;
  endif;
}


function _get_track2($email = '') {
  if(empty($email) || $email == ''):
    return;
  else:
    $url = 'https://www.reproduction-galleries.com/track/track-gallery.php?email=' . $email . '&action=sandbox';
    $datas = array();
    $i = 0;
    $fp = @fopen($url, 'rb');
    while($line = @fgets($fp)):
      $line = trim($line);
      if(empty($line)):
        // Skip
      else:
        list($data['id'], $data['name'], $data['email'], $data['order_number'], $data['painting'], $data['ordered_date'], $data['status'], $data['tracking_number'], $data['airbourne_express'], $data['commissioned_date'], $data['artist'], $data['size'], $data['cost'], $data['deposit'], $data['shipping_cost'], $data['finished_date'], $data['special_comment'], $data['admin_status'], $data['price_paid'], $data['shipping_name'], $data['shipping_street'], $data['shipping_city'], $data['shipping_state'], $data['shipping_zip'], $data['country'], $data['phone_number'], $data['painting_image'], $data['tracking_url'], $data['description'], $data['border'], $data['owner']) = explode('::', $line);
        unset($line);

        $data['id'] = trim($data['id']);
        $data['name'] = trim($data['name']);
        $data['email'] = trim($data['email']);
        $data['order_number'] = trim($data['order_number']);
        $data['painting'] = trim($data['painting']);
        $data['ordered_date'] = trim($data['ordered_date']);
        $data['status'] = trim($data['status']);
        $data['tracking_number'] = trim($data['tracking_number']);
        $data['airbourne_express'] = trim($data['airbourne_express']);
        $data['commissioned_date'] = trim($data['commissioned_date']);
        $data['artist'] = trim($data['artist']);
        $data['size'] = trim($data['size']);
        $data['cost'] = trim($data['cost']);
        $data['deposit'] = trim($data['deposit']);
        $data['shipping_cost'] = trim($data['shipping_cost']);
        $data['finished_date'] = trim($data['finished_date']);
        $data['special_comment'] = trim($data['special_comment']);
        $data['admin_status'] = trim($data['admin_status']);
        $data['price_paid'] = trim($data['price_paid']);
        $data['shipping_name'] = trim($data['shipping_name']);
        $data['shipping_street'] = trim($data['shipping_street']);
        $data['shipping_city'] = trim($data['shipping_city']);
        $data['shipping_state'] = trim($data['shipping_state']);
        $data['shipping_zip'] = strtoupper(trim($data['shipping_zip']));
        $data['country'] = strtoupper(trim($data['country']));
        $data['phone_number'] = trim($data['phone_number']);
        $data['painting_image'] = trim($data['painting_image']);
        $data['tracking_url'] = trim($data['tracking_url']);
        $data['description'] = trim($data['description']);
        $data['border'] = trim($data['border']);
        $data['owner'] = strtolower(trim($data['owner']));

        if(!empty($data['ordered_date'])):
          $data['ordered_date'] = str_replace(' ', '-', $data['ordered_date']);
          list($day, $month, $year) = explode('-', $data['ordered_date']);
          $data['ordered_date'] = $year . '-' . $month . '-' . $day;
          $data['ordered_date'] = strtotime($data['ordered_date']);
          $data['ordered_date'] = date('Y-m-d', $data['ordered_date']);
        endif;

        if(!empty($data['finished_date'])):
          $data['finished_date'] = str_replace(' ', '-', $data['finished_date']);
          list($day, $month, $year) = explode('-', $data['finished_date']);
          $data['finished_date'] = $year . '-' . $month . '-' . $day;
          $data['finished_date'] = strtotime($data['finished_date']);
          $data['finished_date'] = date('Y-m-d', $data['finished_date']);
        endif;

        if(empty($data['owner'])):
          $data['owner'] = 'admin';
        endif;

        $datas[$i] = $data;

        $i++;
      endif;
    endwhile;
    @fclose($fp);

    return $datas;
  endif;
}


function _get_cart() {
  $url = 'https://www.reproduction-galleries.com/rpg/cart/easycart2.php?mode=show&cartname=' . $_COOKIE['_SESSIONID'] . '';
  $content = @file_get_contents($url . '&type=check');
  if($content != $_COOKIE['_SESSIONID']):
    return;
  else:
    $datas = array();
    $i = 0;
    $fp = @fopen($url, 'rb');
    while($line = @fgets($fp)):
      $line = trim($line);
      if(empty($line)):
        // Skip
      else:
        $line = str_ireplace('http://', 'http//', $line);
        $line = str_ireplace('https://', 'https//', $line);
        $line = str_replace(':', '::', $line);
        $line = str_replace('http//', 'http://', $line);
        $line = str_replace('https//', 'https://', $line);
        list($datas[$i]['id'], $datas[$i]['description'], $datas[$i]['price'], $datas[$i]['quantity'], $datas[$i]['price_total'], $datas[$i]['painting_image']) = explode('::', $line);
        $datas[$i]['description'] = stripcslashes($datas[$i]['description']);

        $i++;
      endif;
    endwhile;
    @fclose($fp);

    return $datas;
  endif;
}


function _get_title($script = '', $args = []) {
  $string = $GLOBALS['conf']->default_title;
  $extra_string = '';

  $script = strtolower($script);
  if (!$script || $script == '') {
    $script = 'index';
  }

  if (array_key_exists($script, $GLOBALS['conf']->extra_titles)) {
    $extra_string = $GLOBALS['conf']->extra_titles[$script];
  }

  return $string . $extra_string;
}

function _get_description($script = '', $args = []) {
  $string = $GLOBALS['conf']->default_description;
  $extra_string = '';

  $script = strtolower($script);
  if (!$script || $script == '') {
    $script = 'index';
  }

  if (array_key_exists($script, $GLOBALS['conf']->extra_descriptions)) {
    $extra_string = $GLOBALS['conf']->extra_descriptions[$script];
  }

  return $string . $extra_string;
}

function _get_keywords($script = '', $args = []) {
  $string = $GLOBALS['conf']->default_keywords;
  $extra_string = '';

  $script = strtolower($script);
  if (!$script || $script == '') {
    $script = 'index';
  }

  if (array_key_exists($script, $GLOBALS['conf']->extra_keywords)) {
    $extra_string = $GLOBALS['conf']->extra_keywords[$script];
  }

  return $string . $extra_string;
}


/* function _get_description($script = '', $args1 = '', $args2 = '') {
  $string = '';
  if(empty($script) || !array_key_exists($script, $GLOBALS['conf']->extra_descriptions)):
    $string = $GLOBALS['conf']->extra_descriptions['index'];
  else:
    $string = $GLOBALS['conf']->extra_descriptions[$script];
  endif;

  $string = sprintf($string, $args1, $args2);

  return $string;
}


function _get_keywords($script = '', $args1 = '', $args2 = '') {
  $string = '';
  if(empty($script) || !array_key_exists($script, $GLOBALS['conf']->extra_keywords)):
    $string = $GLOBALS['conf']->extra_keywords['index'];
  else:
    $string = $GLOBALS['conf']->extra_keywords[$script];
  endif;

  $string = sprintf($string, $args1, $args2);

  return $string;
} */


function _get_artist_alternate_name( $artist = '' ) {
  return $artist;

  if ( !$artist ) {
    return [];
  }

  $list = $GLOBALS['conf']->altername_name_list;
  return $list;

  if ( isset( $list[$artist] ) ) {
    return $list[$artist];
  }

  return [];
}


function _get_artists2($column = '', $find = '', $loop = true, $block = true) {
  $log = $GLOBALS['conf']->fields_log;
  $block_artists = _get_check();
  $block_artists_count = count($block_artists);

  if(empty($column)):
    $column_exp = array();
    $column_exp_count = 0;
  else:
    $column_exp = explode('|', $column);
    $column_exp_count = count($column_exp);
  endif;

  if(!file_exists($log)):
    _error('Load datas failed', __LINE__, __FILE__);
  else:
    $fp = fopen($log, 'r');
    if(!$fp):
      _error('Load datas failed', __LINE__, __FILE__);
    else:
      // $a, $b
      $datas = array();
      $i = 0;
      while(($line = fgets($fp)) !== false):
        $pos = strpos(trim($line), 'artist::list:');
        if($pos === false):
          // Skip next line
        else:
          $line = trim(str_replace('artist::list:', '', trim($line)));
          $line = str_replace(', ', ',', $line);
          $line = str_replace(' ,', ',', $line);

          if(empty($line)):
            // Skip
          else:
            $line_exp = explode(',', $line);
            $line_exp_count = 0;
            if ($line_exp) {
              $line_exp_count = count($line_exp);
            }
            unset($line);

            if(empty($line_exp_count)):
              // Skip
            else:
              foreach($line_exp as $key1 => $val1):
                $val1 = trim($val1);

                if(empty($val1)):
                  // Skip
                else:
                  $append = true;

                  if($block === true):
                    for($a = 0; $a < $block_artists_count; $a++):
                      if(strtolower($block_artists[$a]) == strtolower($val1)):
                        $append = false;
                        $GLOBALS['conf']->isBlockedArtist = true;
                        break;
                      endif;
                    endfor;
                  endif;

                  // Skip artist name Jackson Pollock and use Inspired by.
                  if (strtoupper(trim($val1)) === 'JACKSON POLLOCK') {
                    $append = false;
                  }

                  if($append === false):
                    // Skip
                  else:
                    $data['name'] = $val1;
                    $data['mod_name'] = _mod($data['name']);
                    $data['reverse_name'] = '';
                    $data['letter'] = '';
                    $data['nickname'] = '';
                    $data['inspired_by'] = false;
                    $data['has_nickname'] = false;
                    $data['alternative_name'] = '';

                    // $reverse = $data['name'];
                    $reverse = trim(str_replace('-', ' ', $data['name']));
                    $reverse_old = $reverse;

                    if (stripos($reverse, 'inspired by')) {
                      $data['inspired_by'] = true;
                      $reverse = trim(str_ireplace(array('inspired by', '(', ')'), '', $reverse));
                    }

                    // Check name with ()
                    if ($data['inspired_by'] == false && (stripos($data['name'], '(') || stripos($data['name'], ')'))) {
                      $reverse = preg_replace("/(\s)?(\(|\))(\s)?/i", "$1$3", $reverse);

                      preg_match_all("/\(([^\(^\)]+)\)/i", $data['name'], $matches_nickname);
                      if ($matches_nickname && count($matches_nickname) > 0 && isset($matches_nickname[1][0])) {
                        $nickname = trim($matches_nickname[1][0]);
                        // $reverse = preg_replace("/(\s)?\($nickname\)(\s)?/i", "$1{$nickname}$2", $reverse);

                        $data['has_nickname'] = true;
                        $data['nickname'] = $nickname;
                      }
                    }

                    $reverse = explode(' ', $reverse);
                    $sec = $reverse[1];
                    $reverse_count = count($reverse);
                    if($reverse_count <= 1) {
                      $reverse = strtoupper(implode(' ', $reverse));
                      // $reverse = strtoupper($data['name']);
                    } else {
                      $rev1 = $reverse[$reverse_count - 1];
                      unset($reverse[$reverse_count - 1]);
                      $rev2 = trim(implode(' ', $reverse));
                      // $rev2 = trim(str_ireplace($rev1, '', $data['name']));
                      $reverse = strtoupper($rev1) . ', ' . $rev2;
                    }

                    if (isset($data['inspired_by']) && $data['inspired_by'] === true && !stripos($reverse, 'inspired by') >= 0) {
                      $reverse .= ' (Inspired By)';
                    }

                    $data['reverse_name'] = $reverse;
                    $data['reverse_name'] = preg_replace("/\s{2,}/i", " ", $data['reverse_name']);

                    $data['letter'] = strtoupper(substr(trim($reverse), 0, 1));

                    if ($data['mod_name'] == 'pin-ups') {
                      $data['letter'] = 'P';
                      $data['reverse_name'] = $data['name'];
                    }


                    // $options = _get_artist_alternate_name( $data['mod_name'] );
                    // if ( $options ) {
                    //   if ( isset( $options['letter'] ) && $options['letter'] ) {
                    //     $data['letter'] = $options['letter'];
                    //   }
                    //
                    //   if ( isset( $options['alternative_name'] ) && $options['alternative_name'] ) {
                    //     $data['alternative_name'] = $options['alternative_name'];
                    //   }
                    // }

                    /*
                    if ( defined( 'DEMOMODE' ) && DEMOMODE ) {
                      if ( $data['mod_name'] == 'charles-auguste-emile-durand-carolus-duran' ) {
                        echo '<pre>'; print_r( $data ); echo '</pre>';
                        $options = _get_artist_alternate_name( $data['mod_name'] );
                        echo '<pre>'; print_r( $options ); echo '</pre>';
                      }
                    }
                    */

                    if(empty($column_exp_count)):
                      $datas[] = $data;
                      $i++;
                    else:
                      if(empty($find)):
                        $found = false;
                        for($b = 0; $b < $column_exp_count; $b++):
                          if(empty($data[$column_exp[$b]])):
                            $found = true;
                          endif;
                        endfor;

                        if($found === true):
                          $datas[] = $data;
                          $i++;
                        endif;
                      else:
                        if($find == '!'):
                          $found = false;
                          for($b = 0; $b < $column_exp_count; $b++):
                            if(!empty($data[$column_exp[$b]])):
                              $found = true;
                            endif;
                          endfor;

                          if($found === true):
                            $datas[] = $data;
                            $i++;
                          endif;
                        else:
                          $found = false;
                          for($b = 0; $b < $column_exp_count; $b++) {
                            preg_match($find, preg_replace("/\s{2,}/i", " ", $data[$column_exp[$b]]), $matches);
                            // preg_match($find, str_replace("  ", " ", $data[$column_exp[$b]]), $matches);
                            if(!$matches) {
                              // Skip
                            } else {
                              if(!empty($matches[1])) {
                                $found = true;
                              }
                            }
                          }

                          if($found === true):
                            $datas[] = $data;
                            $i++;
                          endif;
                        endif;
                      endif;
                    endif;

                    if($loop === true):
                      // Continue next line
                    else:
                      if($loop === false):
                        break;
                      else:
                        if($i == $loop):
                          break;
                        endif;
                      endif;
                    endif;
                  endif;
                endif;
              endforeach;
            endif;
          endif;
          unset($line);

          break;
        endif;
      endwhile;

      fclose($fp);

      if(!empty($datas)):
        return $datas;
      else:
        return;
      endif;
    endif;
  endif;
}


function _get_paintings2_demo($column = '', $find = '', $loop = true, $block = true) {
  $incurl = $GLOBALS['conf']->incurl;
  $log = $GLOBALS['conf']->datas_log;
  $block_artists = _get_check();
  $block_artists_count = count($block_artists);

  if(empty($column)):
    $column_exp = array();
    $column_exp_count = 0;
  else:
    $column_exp = explode('|', $column);
    $column_exp_count = count($column_exp);
  endif;

  if(!file_exists($log)):
    _error('Load datas failed', __LINE__, __FILE__);
  else:
    $fp = fopen($log, 'r');
    if(!$fp):
      _error('Load datas failed', __LINE__, __FILE__);
    else:
      // $a, $b
      $datas = array();
      $add = false;
      $break = false;
      $i = 0;
      while(($line = fgets($fp)) !== false):
        $append = true;

        list($data['id'], $data['small_image'], $data['large_image'], $data['artist'], $data['refno'], $data['size'], $data['description'], $data['price'], $data['title'], $data['display'], $data['category'], $data['keywords'], $data['special_offer'], $data['special_price'], $data['special_size'], $data['comments'], $data['gallery_name'], $data['height'], $data['width'], $data['az_letter'], $data['artist_reverse'], $data['az_image'], $data['artist_bio'], $data['specials'], $data['bestseller'], $data['new'], $data['gallery'], $data['special_height'], $data['special_width'], $data['colors'], $data['orientation'], $data['subjects'], $data['multiple_purchase'], $data['owner']) = explode('::', $line);
        unset($line);

        $raw = [
          'id' => $data['id'],
          'small_image' => $data['small_image'],
          'large_image' => $data['large_image'],
          'artist' => $data['artist'],
          'refno' => $data['refno'],
          'size' => $data['size'],
          'description' => $data['description'],
          'price' => $data['price'],
          'title' => $data['title'],
          'display' => $data['display'],
          'category' => $data['category'],
          'keywords' => $data['keywords'],
          'special_offer' => $data['special_offer'],
          'special_price' => $data['special_price'],
          'special_size' => $data['special_size'],
          'comments' => $data['comments'],
          'gallery_name' => $data['gallery_name'],
          'height' => $data['height'],
          'width' => $data['width'],
          'az_letter' => $data['az_letter'],
          'artist_reverse' => $data['artist_reverse'],
          'az_image' => $data['az_image'],
          'artist_bio' => $data['artist_bio'],
          'specials' => $data['specials'],
          'bestseller' => $data['bestseller'],
          'new' => $data['new'],
          'gallery' => $data['gallery'],
          'special_height' => $data['special_height'],
          'special_width' => $data['special_width'],
          'colors' => $data['colors'],
          'orientation' => $data['orientation'],
          'subjects' => $data['subjects'],
          'multiple_purchase' => $data['multiple_purchase'],
        ];

        // Check blocked artist first before add more array.
        $data['artist'] = trim($data['artist']);
        if(empty($data['artist'])):
          // Skip to new line
        else:
          if($block === true):
            for($a = 0; $a < $block_artists_count; $a++):
              if(strtolower($block_artists[$a]) == strtolower($data['artist'])):
                $append = false;
                $GLOBALS['conf']->isBlockedArtist = true;
                break;
              endif;
            endfor;
          endif;

          if($append === false):
            // Skip to next line
          else:
            $data['multiple_purchase'] = strtolower(trim($data['multiple_purchase']));
            if(empty($data['multiple_purchase']) || $data['multiple_purchase'] != 'yes'):
              $data['multiple_purchase'] = 'no';
            endif;

            $data['raw_size'] = '';
            $data['raw_special_size'] = '';

            if($data['multiple_purchase'] === 'yes'):
              $data['raw_size'] = $data['size'];
              $data['raw_special_size'] = 'One Click Multiple Purchase';
            endif;

            $data['id'] = trim($data['id']);
            $data['small_image'] = trim(str_ireplace('http:', 'https:', $data['small_image']));
            $data['large_image'] = trim(str_ireplace('http:', 'https:', $data['large_image']));
            $data['az_image'] = trim(str_ireplace('http:', 'https:', $data['az_image']));
            $data['refno'] = trim($data['refno']);
            $data['size'] = strtolower(trim($data['size']));
            $data['description'] = trim($data['description']);
            $data['price'] = trim($data['price']);
            $data['title'] = trim($data['title']);
            $data['display'] = trim($data['display']);
            $data['category'] = trim($data['category']);
            $data['keywords'] = trim($data['keywords']);
            $data['special_offer'] = trim($data['special_offer']);
            $data['special_price'] = trim($data['special_price']);
            $data['special_size'] = strtolower(trim($data['special_size']));
            $data['comments'] = trim($data['comments']);
            $data['gallery_name'] = trim($data['gallery_name']);
            $data['height'] = trim($data['height']);
            $data['width'] = trim($data['width']);
            $data['az_letter'] = strtoupper(trim($data['az_letter']));
            $data['artist_reverse'] = trim($data['artist_reverse']);
            $data['artist_bio'] = trim($data['artist_bio']);
            $data['specials'] = strtolower(trim($data['specials']));
            $data['bestseller'] = strtolower(trim($data['bestseller']));
            $data['new'] = strtolower(trim($data['new']));
            $data['gallery'] = trim($data['gallery_name']);
            $data['special_height'] = trim($data['special_height']);
            $data['special_width'] = trim($data['special_width']);
            $data['colors'] = trim($data['colors']);
            $data['orientation'] = trim($data['orientation']);
            $data['subjects'] = trim($data['subjects']);
            $data['owner'] = strtolower(trim($data['owner']));

            if(!empty($data['size'])):
              $data['size'] = str_replace(' ', '', $data['size']);
              $data['size'] = str_replace('[', '(', $data['size']);
              $data['size'] = str_replace(']', ')', $data['size']);
              $data['size'] = str_replace('x', ' x ', $data['size']);
              $data['size'] = str_replace('cm', ' cm ', $data['size']);
              $data['size'] = str_replace('in', '&quot;', $data['size']);
            endif;

            if(!empty($data['special_size'])):
              $data['special_size'] = str_replace(' ', '', $data['special_size']);
              $data['special_size'] = str_replace('[', '(', $data['special_size']);
              $data['special_size'] = str_replace(']', ')', $data['special_size']);
              $data['special_size'] = str_replace('x', ' x ', $data['special_size']);
              $data['special_size'] = str_replace('cm', ' cm ', $data['special_size']);
              $data['special_size'] = str_replace('in', '&quot;', $data['special_size']);
            else:
              $data['special_size'] = $data['size'];
            endif;

            if(!empty($data['price'])):
              $data['price'] = preg_replace("/[^0-9]/i", '', $data['price']);
            endif;

            if(!empty($data['special_price'])):
              $data['special_price'] = preg_replace("/[^0-9]/i", '', $data['special_price']);
            else:
              $data['special_price'] = $data['price'];
            endif;

            if(!empty($data['width'])):
              $data['width'] = preg_replace("/[^0-9\.]/i", '', $data['width']);
            endif;

            if(!empty($data['height'])):
              $data['height'] = preg_replace("/[^0-9\.]/i", '', $data['height']);
            endif;

            if(!empty($data['special_width'])):
              $data['special_width'] = preg_replace("/[^0-9\.]/i", '', $data['special_width']);
            else:
              $data['special_width'] = $data['width'];
            endif;

            if(!empty($data['special_height'])):
              $data['special_height'] = preg_replace("/[^0-9\.]/i", '', $data['special_height']);
            else:
              $data['special_height'] = $data['height'];
            endif;

            if(empty($data['specials']) || $data['specials'] != 'yes'):
              $data['specials'] = 'no';
            endif;

            if(empty($data['bestseller']) || $data['bestseller'] != 'yes'):
              $data['bestseller'] = 'no';
            endif;

            if(empty($data['new']) || $data['new'] != 'yes'):
              $data['new'] = 'no';
            endif;

            if(empty($data['owner'])):
              $data['owner'] = 'admin';
            endif;

            if(empty($data['artist_reverse'])):
              $exp = explode(' ', str_replace('-', ' ', trim(str_ireplace(array(
                'inspired by',
                '(',
                ')',
              ), '', $data['artist']))));
              $exp_count = count($exp);
              if($exp_count <= 1):
                $reverse = strtoupper($data['artist']);
              else:
                $rev1 = $exp[$exp_count - 1];
                unset($exp[$exp_count - 1]);
                $rev2 = implode(' ', $exp);
                $reverse = strtoupper(trim($rev1)) . ', '. ucwords(trim($rev2));
                unset($exp);
              endif;

              $data['inspired_by'] = false;
              if (stripos($data['artist'], 'inspired by')) {
                $reverse .= ' (Inspired By)';
                $data['inspired_by'] = true;
              }

              $data['artist_reverse'] = trim($reverse);
            endif;

            if(empty($data['az_letter'])):
              $data['az_letter'] = strtoupper(substr($data['artist_reverse'], 0, 1));
            endif;

            if(!empty($data['keywords'])):
              $data['keywords'] = str_replace('<', '&lt;', $data['keywords']);
              $data['keywords'] = str_replace('>', '&gt;', $data['keywords']);
              $data['keywords'] = str_ireplace(array(
                '&lt;br&gt;',
                '&lt;br/&gt;',
                '&lt;br /&gt;'
              ), ',', $data['keywords']);
            endif;

            if(!empty($data['special_offer'])):
              $data['special_offer'] = str_replace('<', '&lt;', $data['special_offer']);
              $data['special_offer'] = str_replace('>', '&gt;', $data['special_offer']);
              $data['special_offer'] = str_ireplace(array(
                '&lt;br&gt;',
                '&lt;br/&gt;',
                '&lt;br /&gt;'
              ), ',', $data['special_offer']);
            endif;

            $data['mod_artist'] = _mod($data['artist']);

            $raw['price'] = $data['price'];
            $data['raw'] = json_encode($raw);

            if(empty($column_exp_count)):
              $datas[] = $data;
              $i++;
            else:
              if(empty($find)):
                $found = false;
                for($b = 0; $b < $column_exp_count; $b++):
                  if(empty($data[$column_exp[$b]])):
                    $found = true;
                  endif;
                endfor;

                if($found === true):
                  $datas[] = $data;
                  $i++;
                endif;
              else:
                if($find == '!'):
                  $found = false;
                  for($b = 0; $b < $column_exp_count; $b++):
                    if(!empty($data[$column_exp[$b]])):
                      $found = true;
                    endif;
                  endfor;

                  if($found === true):
                    $datas[] = $data;
                    $i++;
                  endif;
                else:
                  $_find = $find;
                  $_find = str_replace("/\b(", '', $_find);
                  $_find = str_replace(")\b/i", '', $_find);

                  $found = false;
                  for($b = 0; $b < $column_exp_count; $b++):
                    $new_regex = $data[$column_exp[$b]];
                    if ($column_exp[$b] == 'artist' && stripos($data[$column_exp[$b]], 'inspired by')) {
                      $new_regex = trim(_mod($data[$column_exp[$b]]));
                    }

                    preg_match($find, str_replace("  ", " ", $new_regex), $matches);
                    if(!$matches):
                      // Skip
                    else:
                      if(!empty($matches[1])):
                        $found = true;
                      endif;
                    endif;
                  endfor;

                  if($found === true):
                    $datas[] = $data;
                    $i++;
                  endif;
                endif;
              endif;
            endif;

            if($loop === true):
              // Continue next line
            else:
              if($loop === false):
                break;
              else:
                if($i == $loop):
                  break;
                endif;
              endif;
            endif;
          endif;
        endif;
      endwhile;

      fclose($fp);

      if(!empty($datas)):
        return $datas;
      else:
        return;
      endif;
    endif;
  endif;
}


function _get_paintings2($column = '', $find = '', $loop = true, $block = true) {
  $incurl = $GLOBALS['conf']->incurl;
  $log = $GLOBALS['conf']->datas_log;
  $block_artists = _get_check();
  $block_artists_count = count($block_artists);

  if(empty($column)):
    $column_exp = array();
    $column_exp_count = 0;
  else:
    $column_exp = explode('|', $column);
    $column_exp_count = count($column_exp);
  endif;

  if(!file_exists($log)):
    _error('Load datas failed', __LINE__, __FILE__);
  else:
    $fp = fopen($log, 'r');
    if(!$fp):
      _error('Load datas failed', __LINE__, __FILE__);
    else:
      // $a, $b
      $datas = array();
      $add = false;
      $break = false;
      $i = 0;
      while(($line = fgets($fp)) !== false):
        $append = true;
        $raw = trim($line);

        // Hack replace Jackson Pollock with Inspired By.
        if ($line) {
          $line = str_ireplace('::Jackson Pollock::', '::Jackson Pollock (Inspired By)::', $line);
        }

        list($data['id'], $data['small_image'], $data['large_image'], $data['artist'], $data['refno'], $data['size'], $data['description'], $data['price'], $data['title'], $data['display'], $data['category'], $data['keywords'], $data['special_offer'], $data['special_price'], $data['special_size'], $data['comments'], $data['gallery_name'], $data['height'], $data['width'], $data['az_letter'], $data['artist_reverse'], $data['az_image'], $data['artist_bio'], $data['specials'], $data['bestseller'], $data['new'], $data['gallery'], $data['special_height'], $data['special_width'], $data['colors'], $data['orientation'], $data['subjects'], $data['multiple_purchase'], $data['owner']) = explode('::', $line);
        unset($line);

        // Check blocked artist first before add more array.
        $data['artist'] = trim($data['artist']);
        if(empty($data['artist'])):
          // Skip to new line
        else:
          if($block === true):
            for($a = 0; $a < $block_artists_count; $a++):
              if(strtolower($block_artists[$a]) == strtolower($data['artist'])):
                $append = false;
                $GLOBALS['conf']->isBlockedArtist = true;
                break;
              endif;
            endfor;
          endif;

          if($append === false):
            // Skip to next line
          else:
            // Replace artist Jackson Pollock with Inspired By.
            if (strtoupper(trim($data['artist'])) === 'JACKSON POLLOCK') {
              // $data['artist'] = 'Jackson Pollock (Inspired By)';
            }

            $data['multiple_purchase'] = strtolower(trim($data['multiple_purchase']));
            if(empty($data['multiple_purchase']) || $data['multiple_purchase'] != 'yes'):
              $data['multiple_purchase'] = 'no';
            endif;

            $data['raw_size'] = '';
            $data['raw_special_size'] = '';

            if($data['multiple_purchase'] === 'yes'):
              $data['raw_size'] = $data['size'];
              $data['raw_special_size'] = 'One Click Multiple Purchase';
            endif;

            $data['id'] = trim($data['id']);
            $data['small_image'] = trim(str_ireplace('http:', 'https:', $data['small_image']));
            // $data['small_image'] = str_ireplace('/catalogue', $incurl .'catalogue', $data['small_image']);
            $data['large_image'] = trim(str_ireplace('http:', 'https:', $data['large_image']));
            // $data['large_image'] = str_ireplace('/catalogue', $incurl .'catalogue', $data['large_image']);
            $data['az_image'] = trim(str_ireplace('http:', 'https:', $data['az_image']));
            // $data['az_image'] = str_ireplace('/catalogue', $incurl .'catalogue', $data['az_image']);
            $data['refno'] = trim($data['refno']);
            $data['size'] = strtolower(trim($data['size']));
            $data['description'] = trim($data['description']);
            $data['price'] = trim($data['price']);
            $data['title'] = str_ireplace('’', '\'', $data['title']);
            $data['title'] = trim($data['title']);
            $data['display'] = trim($data['display']);
            $data['category'] = trim($data['category']);
            $data['keywords'] = trim($data['keywords']);
            $data['special_offer'] = trim($data['special_offer']);
            $data['special_price'] = trim($data['special_price']);
            $data['special_size'] = strtolower(trim($data['special_size']));
            $data['comments'] = trim($data['comments']);
            $data['gallery_name'] = trim($data['gallery_name']);
            $data['height'] = trim($data['height']);
            $data['width'] = trim($data['width']);
            $data['az_letter'] = strtoupper(trim($data['az_letter']));
            $data['artist_reverse'] = trim($data['artist_reverse']);
            $data['artist_bio'] = trim($data['artist_bio']);
            $data['specials'] = strtolower(trim($data['specials']));
            $data['bestseller'] = strtolower(trim($data['bestseller']));
            $data['new'] = strtolower(trim($data['new']));
            $data['gallery'] = trim($data['gallery_name']);
            $data['special_height'] = trim($data['special_height']);
            $data['special_width'] = trim($data['special_width']);
            $data['colors'] = trim($data['colors']);
            $data['orientation'] = trim($data['orientation']);
            $data['subjects'] = trim($data['subjects']);
            $data['owner'] = strtolower(trim($data['owner']));

            if(!empty($data['size'])):
              $data['size'] = str_replace(' ', '', $data['size']);
              $data['size'] = str_replace('[', '(', $data['size']);
              $data['size'] = str_replace(']', ')', $data['size']);
              $data['size'] = str_replace('x', ' x ', $data['size']);
              $data['size'] = str_replace('cm', ' cm ', $data['size']);
              $data['size'] = str_replace('in', '&quot;', $data['size']);
            endif;

            if(!empty($data['special_size'])):
              $data['special_size'] = str_replace(' ', '', $data['special_size']);
              $data['special_size'] = str_replace('[', '(', $data['special_size']);
              $data['special_size'] = str_replace(']', ')', $data['special_size']);
              $data['special_size'] = str_replace('x', ' x ', $data['special_size']);
              $data['special_size'] = str_replace('cm', ' cm ', $data['special_size']);
              $data['special_size'] = str_replace('in', '&quot;', $data['special_size']);
            else:
              $data['special_size'] = $data['size'];
            endif;

            if(!empty($data['price'])):
              $data['price'] = preg_replace("/[^0-9]/i", '', $data['price']);
            endif;

            if(!empty($data['special_price'])):
              $data['special_price'] = preg_replace("/[^0-9]/i", '', $data['special_price']);
            else:
              $data['special_price'] = $data['price'];
            endif;

            if(!empty($data['width'])):
              $data['width'] = preg_replace("/[^0-9\.]/i", '', $data['width']);
            endif;

            if(!empty($data['height'])):
              $data['height'] = preg_replace("/[^0-9\.]/i", '', $data['height']);
            endif;

            if(!empty($data['special_width'])):
              $data['special_width'] = preg_replace("/[^0-9\.]/i", '', $data['special_width']);
            else:
              $data['special_width'] = $data['width'];
            endif;

            if(!empty($data['special_height'])):
              $data['special_height'] = preg_replace("/[^0-9\.]/i", '', $data['special_height']);
            else:
              $data['special_height'] = $data['height'];
            endif;

            if(empty($data['specials']) || $data['specials'] != 'yes'):
              $data['specials'] = 'no';
            endif;

            if(empty($data['bestseller']) || $data['bestseller'] != 'yes'):
              $data['bestseller'] = 'no';
            endif;

            if(empty($data['new']) || $data['new'] != 'yes'):
              $data['new'] = 'no';
            endif;

            if(empty($data['owner'])):
              $data['owner'] = 'admin';
            endif;


            /*
            $to_rename = [
              'Alexei von Jawlensky' => 'Alexej von Jawlensky',
              'Alvar Cawen Also' => 'Alvar Cawen',
              'Elin Kleopatra Danielson GAMBOGI' => 'Elin Kleopatra Danielson Gambogi',
              'Max Kurzveil' => 'Max Kurzweil',
              'Rex Gorliegh' => 'Rex Goreleigh',
              'Sir Edward Coley Burne-jones' => 'Sir Edward Coley Burne-Jones',
            ];

            if (in_array($data['artist'], $to_rename)) {
              $data['artist_reverse'] = '';
            }
            */


            if(empty($data['artist_reverse'])):
              $exp = explode(' ', str_replace('-', ' ', trim(str_ireplace(array(
                'inspired by',
                '(',
                ')',
              ), '', $data['artist']))));
              $exp_count = count($exp);
              if($exp_count <= 1):
                $reverse = strtoupper($data['artist']);
              else:
                $rev1 = $exp[$exp_count - 1];
                unset($exp[$exp_count - 1]);
                $rev2 = implode(' ', $exp);
                $reverse = strtoupper(trim($rev1)) . ', '. ucwords(trim($rev2));
                unset($exp);
              endif;

              $data['inspired_by'] = false;
              if (stripos($data['artist'], 'inspired by')) {
                $reverse .= ' (Inspired By)';
                $data['inspired_by'] = true;
              }

              $data['artist_reverse'] = trim($reverse);
            endif;

            if(empty($data['az_letter'])):
              $data['az_letter'] = strtoupper(substr($data['artist_reverse'], 0, 1));
            endif;

            if(!empty($data['keywords'])):
              $data['keywords'] = str_replace('<', '&lt;', $data['keywords']);
              $data['keywords'] = str_replace('>', '&gt;', $data['keywords']);
              $data['keywords'] = str_ireplace(array(
                '&lt;br&gt;',
                '&lt;br/&gt;',
                '&lt;br /&gt;'
              ), ',', $data['keywords']);
            endif;

            if(!empty($data['special_offer'])):
              $data['special_offer'] = str_replace('<', '&lt;', $data['special_offer']);
              $data['special_offer'] = str_replace('>', '&gt;', $data['special_offer']);
              $data['special_offer'] = str_ireplace(array(
                '&lt;br&gt;',
                '&lt;br/&gt;',
                '&lt;br /&gt;'
              ), ',', $data['special_offer']);
            endif;

            $data['mod_artist'] = _mod($data['artist']);
            $data['mod_title'] = _mod($data['title']);

            if ($data['mod_artist'] == 'pin-ups') {
              $data['az_letter'] = 'P';
            }

            $data['data_uri'] = $data['id'] . '/' . $data['mod_title'] . '-by-' . $data['mod_artist'] . '/';

            $data['raw'] = '';
            if ( DEMOMODE ) {
              $data['raw'] = $raw;
            }

            $artistStartPrice = _artist_start_price($data['mod_artist']);
            $originalPrice = $data['price'];
            $price = ($originalPrice < $artistStartPrice) ? $artistStartPrice : $originalPrice;
            $data['price'] = $price;

            if ($_SERVER['REMOTE_ADDR'] == '134.236.16.167') {

            }

            $oriental = _get_oriental($data['width'], $data['height']);

            $new_longest_size = 75;
            $new_percentage = (75 * 100) / $oriental['longest_size'];
            $new_shortest_size = number_format(($oriental['shortest_size'] * $new_percentage) / 100, 0, '.', '');
            $oriental['longest_size'] = 75;
            $oriental['shortest_size'] = $new_shortest_size;
            $oriental['original_' . $oriental['longest_side']] = $oriental['longest_size'];
            $oriental['original_' . $oriental['shortest_side']] = $oriental['shortest_size'];

            $height_inches = number_format($oriental['original_height'] / 2.54, 1, '.', '');
            $width_inches = number_format($oriental['original_width'] / 2.54, 1, '.', '');

            $data['size'] = ''. $oriental['original_height'] .' x '. $oriental['original_width'] .' cm ('. $height_inches .' x '. $width_inches .'&quot;)';

            if(empty($column_exp_count)):
              $datas[] = $data;
              $i++;
            else:
              if(empty($find)):
                $found = false;
                for($b = 0; $b < $column_exp_count; $b++):
                  if(empty($data[$column_exp[$b]])):
                    $found = true;
                  endif;
                endfor;

                if($found === true):
                  $datas[] = $data;
                  $i++;
                endif;
              else:
                if($find == '!'):
                  $found = false;
                  for($b = 0; $b < $column_exp_count; $b++):
                    if(!empty($data[$column_exp[$b]])):
                      $found = true;
                    endif;
                  endfor;

                  if($found === true):
                    $datas[] = $data;
                    $i++;
                  endif;
                else:
                  $_find = $find;
                  $_find = str_replace("/\b(", '', $_find);
                  $_find = str_replace(")\b/i", '', $_find);

                  $found = false;
                  for($b = 0; $b < $column_exp_count; $b++):
                    $new_regex = $data[$column_exp[$b]];
                    if ($column_exp[$b] == 'artist' && stripos($data[$column_exp[$b]], 'inspired by')) {
                      $new_regex = trim(_mod($data[$column_exp[$b]]));
                    }

                    preg_match($find, str_replace("  ", " ", $new_regex), $matches);
                    if(!$matches):
                      // Skip
                    else:
                      if(!empty($matches[1])):
                        $found = true;
                      endif;
                    endif;
                  endfor;

                  if($found === true):
                    $datas[] = $data;
                    $i++;
                  endif;
                endif;
              endif;
            endif;

            if($loop === true):
              // Continue next line
            else:
              if($loop === false):
                break;
              else:
                if($i == $loop):
                  break;
                endif;
              endif;
            endif;
          endif;
        endif;
      endwhile;

      fclose($fp);

      if(!empty($datas)):
        return $datas;
      else:
        return;
      endif;
    endif;
  endif;
}


function _get_testimonials2($column = '', $find = '', $loop = true) {
  $log = $GLOBALS['conf']->testimonials_log;

  if(empty($column)):
    $column_exp = array();
    $column_exp_count = 0;
  else:
    $column_exp = explode('|', $column);
    $column_exp_count = count($column_exp);
  endif;

  if(!file_exists($log)):
    _error('Load testimonials failed', __LINE__, __FILE__);
  else:
    $fp = fopen($log, 'r');
    if(!$fp):
      _error('Load testimonials failed', __LINE__, __FILE__);
    else:
      // $a, $b
      $datas = array();
      $add = false;
      $break = false;
      $i = 0;
      while(($line = fgets($fp)) !== false):
        $append = true;

        list($data['id'], $data['day'], $data['month'], $data['year'], $data['message'], $data['name'], $data['show'], $data['owner']) = explode('::', $line);
        unset($line);

        $data['id'] = trim($data['id']);
        $data['day'] = trim($data['day']);
        $data['month'] = trim($data['month']);
        $data['year'] = trim($data['year']);
        $data['message'] = trim($data['message']);
        $data['name'] = trim($data['name']);
        $data['show'] = strtolower(trim($data['show']));
        $data['owner'] = strtolower(trim($data['owner']));

        $data['message'] = str_replace('<BR>', '<br>', $data['message']);
        if(substr($data['message'], -4) == '<br>'):
          $data['message'] = substr($data['message'], 0, -4);
        endif;
        if(substr($data['message'], 0, 4) == '<br>'):
          $data['message'] = substr($data['message'], 4);
        endif;
        $data['message'] = rtrim($data['message'], '<br>');
        $data['message'] = str_replace('<br>', '<br />', $data['message']);


        if(!empty($data['day'])):
          $data['day'] = preg_replace("/[^0-9]/i", '', $data['day']);
        else:
          $data['day'] = date('d', time());
        endif;

        if(!empty($data['month'])):
          $data['month'] = preg_replace("/[^0-9]/i", '', $data['month']);
        else:
          $data['month'] = date('m', time());
        endif;

        if(!empty($data['year'])):
          $data['year'] = preg_replace("/[^0-9]/i", '', $data['year']);
        else:
          $data['year'] = date('Y', time());
        endif;

        if(empty($data['show']) || $data['show'] != 'yes'):
          $data['show'] = 'no';
        endif;

        if(empty($data['owner'])):
          $data['owner'] = 'admin';
        endif;

        $data['date'] = $data['year'] . '-' . $data['month'] . '-' . $data['day'];
        unset($data['year'], $data['month'], $data['day']);

        if(empty($column_exp_count)):
          $datas[] = $data;
          $i++;
        else:
          if(empty($find)):
            $found = false;
            for($b = 0; $b < $column_exp_count; $b++):
              if(empty($data[$column_exp[$b]])):
                $found = true;
              endif;
            endfor;

            if($found === true):
              $datas[] = $data;
              $i++;
            endif;
          else:
            if($find == '!'):
              $found = false;
              for($b = 0; $b < $column_exp_count; $b++):
                if(!empty($data[$column_exp[$b]])):
                  $found = true;
                endif;
              endfor;

              if($found === true):
                $datas[] = $data;
                $i++;
              endif;
            else:
              $found = false;
              for($b = 0; $b < $column_exp_count; $b++):
                preg_match($find, str_replace("  ", " ", $data[$column_exp[$b]]), $matches);
                if(!$matches):
                  // Skip
                else:
                  if(!empty($matches[1])):
                    $found = true;
                  endif;
                endif;
              endfor;

              if($found === true):
                $datas[] = $data;
                $i++;
              endif;
            endif;
          endif;
        endif;

        if($loop === true):
          // Continue next line
        else:
          if($loop === false):
            break;
          else:
            if($i == $loop):
              break;
            endif;
          endif;
        endif;
      endwhile;

      fclose($fp);

      if(!empty($datas)):
        return $datas;
      else:
        return;
      endif;
    endif;
  endif;
}


/**
 * Print error HTML codes.
 */
function _get_error_html() {
  global $conf;

  $html = '<div id="wrapper"><div class="_template"><header id="header"><div class="_template"><div class="logo"><img src="'. $conf->brand_logo .'" width="100%" alt="'. $conf->og_tags['site_name'] .'" /></div></div></header><main id="content"><div class="_template"><h1 class="title">{title}</h1>{content}</div></main><footer id="footer"><div class="_template">{footer}</div></footer><!-- {hidden} --></div></div>';

  return $html;
}


/**
 * Get error code and message.
 */
function _get_errors($errcode = '') {
  $conf = $GLOBALS['conf'];
  $GLOBALS['conf'] = &$conf;

  require $conf->lib . 'errors.inc.php';

  if(empty($errcode) || !isset($conf->errors[$errcode])):
    $errcode = 'unknown';
  endif;

  return array($errcode, $conf->errors[$errcode]);
}


if (!function_exists('_get_artist_bio')) {
  function _get_artist_bio($artist) {
    global
      $conf,
      $db;

    if (!$artist) {
      return;
    }

    $data = $db->select($conf->prefix.'artists_text', " * from {table} where slug = '". $artist ."' ");
    if (empty($data)) {
      $data = '';
    } else {
      $data = $data[0];
    }

    if (isset($data['description']) && $data['description']) {
      return $data['description'];
    }

    return;
  }
}
