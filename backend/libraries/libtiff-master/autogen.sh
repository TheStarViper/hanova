#!/bin/sh
#
# Libtiff Autotools bootstrap script.
#
# See the `HOWTO-RELEASE` file for the details of how this script may
# be used as part of libtiff maintenance, and/or read the comments
# below.
#

retval=0

set -x

autoreconf --install --force || retval=$?

# The latest 'gitlog-to-changelog', 'config.guess', and 'config.sub'
# files are in the git repository at
# 'https://git.savannah.gnu.org/git/gnulib.git' and may be found in
# its 'build-aux' subdirectory.
#
# Check-out gnulib adjacent to this source tree so this script can
# update the build-aux files.
#   e.g. git clone https://git.savannah.gnu.org/git/gnulib.git
# Then make sure that the gnulib clone is updated prior to running this script.

build_aux=../gnulib/build-aux
if [ -d ${build_aux} ] ; then
    printf "%s\n" "Updating build-aux files..."
    for f in config.guess config.sub
    do
        cp -p ${build_aux}/${f} config/
    done
fi

exit $retval
