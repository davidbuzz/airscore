<?php
/**
 * backwards compatibility old php functions - from info@itxplain.nl
 */

function mysql_connect($server, $username, $password, $new_link = false, $client_flags = null) 
{
    $key = $server.$username.$password;
    if (isset($GLOBALS['mysql_cons']) == false) {
        $GLOBALS['mysql_cons'] = false;
    }
    if ($new_link == false && isset($GLOBALS['mysql_cons'][$key])) {
        return $GLOBALS['mysql_cons'][$key];
    }

    $con = new mysqli($server, $username, $password);

    if (isset($GLOBALS['mysql_cons'][$key]) == false) {
        $GLOBALS['mysql_cons'][$key] = $con;
    }

    if (isset($GLOBALS['mysql_cons']['default']) == false) {
       $GLOBALS['mysql_cons']['default'] = $con;
    }

    $r = $con->connect($server, $username, $password);

    if ($r === false)
        return false;

    return $con;
}

function mysql_select_db($dbname, $con=null) 
{
    if ($con == null) {
        $con = $GLOBALS['mysql_cons']['default'];
    }

    $r = $con->select_db($dbname);
    return $r;
}

function mysql_query($query, $con=null) 
{
    if ($con == null) {
        $con = $GLOBALS['mysql_cons']['default'];
    }

    return $con->query($query);
}

function mysql_real_escape_string($val, $con=null) 
{
    if ($con == null) {
        $con = $GLOBALS['mysql_cons']['default'];
    }

    return $con->escape_string($val);
}


function mysql_insert_id($con=null) 
{
    if ($con == null) {
        $con = $GLOBALS['mysql_cons']['default'];
    }

    return $con->insert_id;
}

function mysql_error($con=null) 
{
    if ($con == null) {
        $con = $GLOBALS['mysql_cons']['default'];
    }

    return $con->error;
}

function mysql_fetch_assoc($result) 
{
    $row = $result->fetch_assoc();

    return $row;
}

function mysql_fetch_array($result) 
{
    $row = $result->fetch_array();

    return $row;
}

function mysql_result($result, $row, $col) 
{
    $row = $result->fetch_array();
    return $row[$row][$col];
}

function mysql_num_rows($result) 
{
	return $result->num_rows;
}

function split($pattern, $string, $limit=-1) 
{
	return preg_split('/'.$pattern.'/', $string, $limit);
}

function mysql_close($con=null) 
{
	return null;
}

?>
