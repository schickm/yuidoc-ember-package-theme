module.exports = {
    contextKeys: function(context) {
        if (context == null) {
            context = this;
        }

        for(var k in context) {
            console.log("key = " + k);
        }
    },

    tagClass: function() {
        var classes = this.classes;

        var pkgs = [];
        for (var i = 0; i < classes.length; i++) {
            if (classes[i].access === 'package' && this.name !== classes[i].name) {
                pkgs.push(classes[i].name);
            }
        }

        for(var i = 0; i < classes.length; i++) {
            if (classes[i].name === this.name) {
                var access    = classes[i].access,
                    className = classes[i].name;

                if (className == null) {
                    continue;
                }

                this.isPackageClass = access === 'package';
                this.isPublicClass  = access === 'public' ;
                this.isPrivateClass = access === 'private';
                this.isExtendedWithPrivate = false;

                if (this.extends != null) {
                    for (var n = 0; n < this.classes.length; n++) {
                        if (this.classes[n].name === this.extends && this.classes[n].access === 'private') {
                            this.isExtendedWithPrivate = true;
                            break;
                        }
                    }
                }

                var maxLen = 0, pkgName = null, methodCount = 0;
                for(var j = 0; j < pkgs.length; j++) {
                    if (pkgs[j].length > maxLen && className.indexOf(pkgs[j]) === 0) {
                        maxLen  = pkgs[j].length;
                        pkgName = pkgs[j];
                    }
                }

                this.packageName = pkgName;
                this.showMethodsIndex = this.methods != null && this.methods.length > 3;
                break;
            }
        }
    },

    packages: function(context, options) {
        'use strict';
        var ret = "";
        for (var i = 0; i < context.length; i++) {
            if (context[i].access === 'package') {
                ret = ret + options.fn(context[i]);
            }
        }
        return ret;
    },

    publicClasses: function(context, options) {
        'use strict';
        var ret = "";
        for (var i = 0; i < context.length; i++) {
            if (context[i].access === 'public') {
                ret = ret + options.fn(context[i]);
            }
        }
        return ret;
    },

    packageClasses: function(context, options) {
        'use strict';
        var ret = "";
        var pkgs = [];
        for (var i = 0; i < context.length; i++) {
            if (context[i].access === 'package' && this.name !== context[i].name) {
                pkgs.push(context[i].name);
            }
        }

        for (var i = 0; i < context.length; i++) {
            var className = context[i].name;
            if (className != null && className !== this.name && pkgs.indexOf(className) < 0 && className.indexOf(this.name) === 0) {
                var b = false;
                for (var j = 0; j < pkgs.length; j++) {
                    if (pkgs[j].length > this.name.length && className.indexOf(pkgs[j]) === 0) {
                        b = true;
                        break;
                    }
                }

                if (!b) {
                    ret = ret + options.fn(context[i]);
                }
            }
        }
        return ret;
    }
};