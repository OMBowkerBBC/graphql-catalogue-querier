provider "aws" {
  region = "eu-west-2"
  shared_credentials_files = ["credentials"]
}

resource "aws_security_group" "main" {
  egress = [
    {
      cidr_blocks      = [ "0.0.0.0/0", ]
      description      = ""
      from_port        = 0
      ipv6_cidr_blocks = []
      prefix_list_ids  = []
      protocol         = "-1"
      security_groups  = []
      self             = false
      to_port          = 0
    }
  ]
 ingress                = [
   {
     cidr_blocks      = [ "0.0.0.0/0", ]
     description      = ""
     from_port        = 22
     ipv6_cidr_blocks = []
     prefix_list_ids  = []
     protocol         = "tcp"
     security_groups  = []
     self             = false
     to_port          = 22
  }
  ]
}

resource "tls_private_key" "ssh_key" {
  algorithm = "RSA"
  rsa_bits = 4096
}

resource "aws_key_pair" "key_pair" {
  key_name = "bbc_graphql_keys"
  public_key = tls_private_key.ssh_key.public_key_openssh

  provisioner "local-exec" {
    command = <<-EOT
      echo '${tls_private_key.ssh_key.private_key_pem}' > ./ec2key.pem
      chmod 400 ./ec2key.pem
    EOT
  }
}

resource "aws_instance" "test_instance" {
  tags = {
      Name = "Terraform Test"
  }
  ami = "ami-0015a39e4b7c0966f"
  instance_type = "t2.micro"
  key_name = aws_key_pair.key_pair.key_name
  vpc_security_group_ids = [aws_security_group.main.id]
}

output "ec2_address" {
  description = "EC2 SSH address"
  value = "ubuntu@${aws_instance.test_instance.public_dns}"
}