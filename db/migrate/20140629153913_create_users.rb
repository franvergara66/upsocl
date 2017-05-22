class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :rut
      t.string :first_name
      t.string :last_name
      t.string :email
      t.string :phone
      t.string :facebook
      t.string :twitter
      t.timestamps
    end
  end
end
