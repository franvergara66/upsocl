class User < ActiveRecord::Base
  validates :rut, :first_name, :last_name, :email, :facebook, :twitter, presence: true
  has_many :addresses, :dependent => :destroy
  accepts_nested_attributes_for :addresses, allow_destroy: true, reject_if: :all_blank

  # has_attached_file :avatar, :styles => { :medium => "200x200>", :thumb => "100x100#" }, :default_url => "/images/:style/missing.jpg"
  # validates_attachment_content_type :avatar, :content_type => /\Aimage\/.*\Z/

  def as_json(options={})
    super(:include => [:addresses])
  end
end
