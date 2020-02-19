var sql = require('../db');

module.exports = {
    getSettings: function(req, res){
        return new Promise(function(resolve, reject) {
			sql.query("Select * from settings ", function (err, rows) {
				if (err) {
				    reject(err)
                }
                else {
                    resolve(rows)
                }
            })
        });
    },
	update: function(req,res) {
        console.log(req)
		return new Promise(function(resolve, reject) {
			sql.query("Select * from settings ", function (err, rows) {
				if (err) {
				    console.log(err)
                }
                else {
                    var key = ['logo','title','about_us','privacy','term_condition'];
                    var arr = [];
                    var logo = req.file.filename;
                    arr.push(logo);
                    var title = req.body.title;
                    arr.push(title);
                    var about = req.body.about_us;
                    arr.push(about);
                    var privacy = req.body.privacy;
                    arr.push(privacy);
                    var term = req.body.term_conditions;
                    arr.push(term);
                    if(rows.length == 0){
                        var i = 0;
                        var saved = []
                        key.forEach(element => {
                            // console.log()
                            sql.query("INSERT INTO `settings`(`key_name`, `key_value`) VALUES ('"+element+"','"+arr[i]+"')",function(err,rows){
                                if(err){
                                    console.log(err)
                                }
                                else{
                                    saved.push(rows);
                                }
                            });
                            i++;
                            
                        });
                        resolve(saved);
                    }
                    else{
                        var saved = []
                        var i = 0;
                        key.forEach(element => {
                            sql.query("UPDATE `settings` SET `key_value`='"+arr[i]+"' WHERE `key_name`='"+element+"'",function(err,rows){
                                if(err){
                                    console.log(err)
                                }
                                else{
                                    saved.push(rows);
                                }
                            });
                            i++;
                            
                        });
                        resolve(saved);
                    }
                }
				// resolve(count);
			});
		});
    },
}