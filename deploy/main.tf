provider "aws" {
  region = "eu-west-2"
  shared_credentials_files = ["credentials"]
}

resource "aws_security_group" "main" {
  egress = [
    {
      cidr_blocks = [ "0.0.0.0/0", ]
      from_port = 0
      protocol = "-1"
      self = false
      to_port = 0
      description = ""
      ipv6_cidr_blocks = []
      prefix_list_ids = []
      security_groups = []
    }
  ]
 ingress                = [
   {
     cidr_blocks      = [ "0.0.0.0/0", ]
     from_port        = 22
     protocol         = "tcp"
     self             = false
     to_port          = 22
     description = ""
     ipv6_cidr_blocks = []
     prefix_list_ids = []
     security_groups = []
  },
     {
     cidr_blocks      = [ "0.0.0.0/0", ]
     from_port        = 3001
     protocol         = "tcp"
     self             = false
     to_port          = 3001
     description = ""
     ipv6_cidr_blocks = []
     prefix_list_ids = []
     security_groups = []
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
      chmod 700 ./ec2key.pem
    EOT
  }
}

resource "aws_instance" "main_instance" {
  tags = {
      Name = "Catalogue-GraphQL"
  }
  ami = "ami-0015a39e4b7c0966f"
  instance_type = "t2.micro"
  key_name = aws_key_pair.key_pair.key_name
  vpc_security_group_ids = [aws_security_group.main.id]
  user_data = "${file("init.sh")}"
}

output "ec2_ssh_command" {
  description = "EC2 SSH Address"
  value = "ssh -i ci/ec2key.pem ubuntu@${aws_instance.main_instance.public_dns}"
}

output "ec2_health_address" {
  description = "GraphQL Browser Adress"
  value = "http://${aws_instance.main_instance.public_dns}:3001/health"
}