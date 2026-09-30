# Tag Image File Format (TIFF) Software
#
# Copyright (C) 2004, Andrey Kiselev <dron@ak4719.spb.edu>
#
# Permission to use, copy, modify, distribute, and sell this software and 
# its documentation for any purpose is hereby granted without fee, provided
# that (i) the above copyright notices and this permission notice appear in
# all copies of the software and related documentation, and (ii) the names of
# Sam Leffler and Silicon Graphics may not be used in any advertising or
# publicity relating to the software without the specific, prior written
# permission of Sam Leffler and Silicon Graphics.
# 
# THE SOFTWARE IS PROVIDED "AS-IS" AND WITHOUT WARRANTY OF ANY KIND, 
# EXPRESS, IMPLIED OR OTHERWISE, INCLUDING WITHOUT LIMITATION, ANY 
# WARRANTY OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE.  
# 
# IN NO EVENT SHALL SAM LEFFLER OR SILICON GRAPHICS BE LIABLE FOR
# ANY SPECIAL, INCIDENTAL, INDIRECT OR CONSEQUENTIAL DAMAGES OF ANY KIND,
# OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS,
# WHETHER OR NOT ADVISED OF THE POSSIBILITY OF DAMAGE, AND ON ANY THEORY OF 
# LIABILITY, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE 
# OF THIS SOFTWARE.

# Process this file with automake to produce Makefile.in.

docdir = $(LIBTIFF_DOCDIR)

AUTOMAKE_OPTIONS = 1.11 dist-zip foreign
ACLOCAL_AMFLAGS = -I m4

docfiles = \
	ChangeLog \
	LICENSE.md \
	README.md \
	RELEASE-DATE \
	TODO \
	VERSION

EXTRA_DIST = \
	placeholder.h \
	cmake \
	CMakeLists.txt \
	HOWTO-RELEASE \
	autogen.sh \
	libtiff-4.pc.in

if TIFF_DOCS
dist_doc_DATA = $(docfiles)
endif

distcheck-hook:
	if [ -x "$(CMAKE)" ]; then \
	  mkdir $(distdir)/_build/cmake \
	  && cd $(distdir)/_build/cmake \
	  && cmake -Dsphinx=OFF ../.. \
	  && $(MAKE) \
	  && ctest -V \
	  && $(MAKE) DESTDIR=../../_inst/cmake install ; \
	fi
	rm -rf $(distdir)/_build/cmake
	rm -rf $(distdir)/_inst/cmake

SUBDIRS = port libtiff tools build contrib test doc


NEW_LIBTIFF_RELEASE_DATE=$(shell date +"%Y%m%d")

release:
	@(echo --- Setting release date to $(NEW_LIBTIFF_RELEASE_DATE) and release version to $(LIBTIFF_VERSION) ---)
	(rm -f $(top_srcdir)/RELEASE-DATE && echo $(NEW_LIBTIFF_RELEASE_DATE) > $(top_srcdir)/RELEASE-DATE)
	(rm -f $(top_srcdir)/VERSION && echo $(LIBTIFF_VERSION) > $(top_srcdir)/VERSION)
	(rm -f $(top_builddir)/libtiff/tiffvers.h && sed 's,LIBTIFF_VERSION,$(LIBTIFF_VERSION),;s,LIBTIFF_RELEASE_DATE,$(NEW_LIBTIFF_RELEASE_DATE),;s,LIBTIFF_MAJOR_VERSION,$(LIBTIFF_MAJOR_VERSION),;s,LIBTIFF_MINOR_VERSION,$(LIBTIFF_MINOR_VERSION),;s,LIBTIFF_MICRO_VERSION,$(LIBTIFF_MICRO_VERSION),' $(top_srcdir)/libtiff/tiffvers.h.in > $(top_builddir)/libtiff/tiffvers.h && sed -i 's,@,,g' $(top_builddir)/libtiff/tiffvers.h)

pkgconfigdir = $(libdir)/pkgconfig
pkgconfig_DATA = libtiff-4.pc

# Special rules to assist with Coverity submissions.
#
# Put the Coverity submission key in $(HOME)/.coverity_key_tiff
# Put your email address in $(HOME)/.coverity_email_tiff
PACKAGE_CHANGE_DATE=`git -C $(top_srcdir) log -1 --format=%as`
COVERITY_TARBALL=libtiff-cov.xz
COVERITY_VERSION=devel-${PACKAGE_CHANGE_DATE}
COVERITY_DESCRIPTION='libtiff development'
COVERITY_COV_INT='cov-int'

# Special cleaning rules
clean-local:
	$(RM) -rf $(COVERITY_COV_INT)

# Build under Coverity
coverity-build:
	$(MAKE) clean
	$(RM) -rf $(COVERITY_COV_INT)
	cov-build --dir cov-int $(MAKE)

coverity: coverity-build
	tar caf $(COVERITY_TARBALL) $(COVERITY_COV_INT)
	curl  \
	--form token=`cat $$HOME/.coverity_key_tiff` \
	--form email=`cat $$HOME/.coverity_email_tiff` \
	--form file=@$(COVERITY_TARBALL) \
	--form version=$(COVERITY_VERSION) \
	--form description=$(COVERITY_DESCRIPTION) \
	https://scan.coverity.com/builds?project=tiff
	$(RM) $(COVERITY_TARBALL)

# Run the Clang analyzer ('scan-build') on the project.
#
# In order for this to work, you must have first installed the 'clang'
# and 'clang-tools' packages on your system.
#
# The project should be configured to use clang using something
# like
#
# /path/to/libtiff/configure CC=clang CXX=clang++
#
# After doing a 'make scan-build' (which will issue additional
# warnings for each issue found), watch for instructions at the end of
# the build for how to run 'scan-view' with a provided local
# path. Scan-view runs a local http server on your computer and opens
# a (defaulted) browser window on it to view defects.
#
# The '-enable-checker
# security.insecureAPI.DeprecatedOrUnsafeBufferHandling' option
# deprecates the memcpy, memmove, memset, snprintf, sprintf, sscanf,
# strncpy, vsnprintf, etc., ANSI C'11 "_s" functions, which GNU libc
# did not implement and Microsoft's compiler has implemented
# differently.  Don't bother trying to use it.
#
scan-build:
	scan-build -k --html-title='libtiff scan-build' \
	-maxloop 10000 \
	-disable-checker deadcode.DeadStores \
	-enable-checker security.insecureAPI.bcmp \
	-enable-checker security.insecureAPI.bcopy \
	-enable-checker security.insecureAPI.bzero \
	-enable-checker security.insecureAPI.strcpy \
	-enable-checker valist.CopyToSelf \
	-enable-checker valist.Uninitialized \
	-enable-checker valist.Unterminated \
	--use-cc $(CC) $(MAKE)
